import { invoke } from "@tauri-apps/api/core";

type ServiceSnapshot = {
  key: string;
  label: string;
  port: number;
  enabled: boolean;
  ready: boolean;
  required: boolean;
  state: string;
};

type RuntimeSnapshot = {
  appName: string;
  launcherMode: string;
  ready: boolean;
  uiUrl: string;
  logsDir: string;
  services: ServiceSnapshot[];
  message?: string | null;
};

const state = {
  busy: false,
  snapshot: null as RuntimeSnapshot | null,
  error: "",
};

const phasePill = document.querySelector<HTMLElement>("#phase-pill");
const summaryEl = document.querySelector<HTMLElement>("#summary");
const errorEl = document.querySelector<HTMLElement>("#error-msg");
const servicesEl = document.querySelector<HTMLElement>("#services");
const logsPathEl = document.querySelector<HTMLElement>("#logs-path");
const launchBtn = document.querySelector<HTMLButtonElement>("#launch-btn");
const retryBtn = document.querySelector<HTMLButtonElement>("#retry-btn");
const openBtn = document.querySelector<HTMLButtonElement>("#open-btn");
const refreshBtn = document.querySelector<HTMLButtonElement>("#refresh-btn");
const stopBtn = document.querySelector<HTMLButtonElement>("#stop-btn");
const logsBtn = document.querySelector<HTMLButtonElement>("#logs-btn");

function setBusy(busy: boolean, label = "Initialisation") {
  state.busy = busy;

  if (phasePill) {
    phasePill.textContent = busy ? `${label}...` : state.snapshot?.ready ? "Pret" : "En attente";
    phasePill.dataset.state = busy ? "busy" : state.snapshot?.ready ? "ready" : "idle";
  }

  [launchBtn, retryBtn, openBtn, refreshBtn, stopBtn, logsBtn].forEach((button) => {
    if (!button) {
      return;
    }
    button.disabled = busy;
  });
}

function renderServices(services: ServiceSnapshot[]) {
  if (!servicesEl) {
    return;
  }

  servicesEl.innerHTML = services
    .map((service) => {
      const tone = service.ready
        ? "ready"
        : service.enabled
          ? "offline"
          : "disabled";
      const meta = service.enabled ? `port ${service.port}` : "desactive";
      return `
        <article class="service service--${tone}">
          <div>
            <p class="service__label">${service.label}</p>
            <p class="service__meta">${meta}</p>
          </div>
          <span class="service__state">${service.state}</span>
        </article>
      `;
    })
    .join("");
}

function renderSnapshot(snapshot: RuntimeSnapshot | null) {
  if (!summaryEl || !logsPathEl) {
    return;
  }

  if (!snapshot) {
    summaryEl.textContent = "Le shell Tauri attend la stack locale A11.";
    logsPathEl.textContent = "";
    renderServices([]);
    return;
  }

  const requiredServices = snapshot.services.filter((service) => service.required && service.enabled);
  const readyCount = requiredServices.filter((service) => service.ready).length;
  const totalCount = requiredServices.length;

  summaryEl.textContent = snapshot.ready
    ? `La stack locale est prete. Le chat va s'ouvrir sur ${snapshot.uiUrl}.`
    : `${readyCount}/${totalCount} services critiques sont prets.`;

  logsPathEl.textContent = snapshot.logsDir ? `Logs: ${snapshot.logsDir}` : "";
  renderServices(snapshot.services);
  openBtn?.toggleAttribute("hidden", !snapshot.ready);
}

function renderError(message: string) {
  state.error = message;
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.hidden = !message;
  }
}

async function fetchSnapshot() {
  const snapshot = await invoke<RuntimeSnapshot>("get_runtime_snapshot");
  state.snapshot = snapshot;
  renderSnapshot(snapshot);
  return snapshot;
}

async function openChatAndCloseShell() {
  await invoke("open_chat_window");
  await invoke("close_shell_window");
}

async function startStack(label = "Demarrage") {
  setBusy(true, label);
  renderError("");
  try {
    const snapshot = await invoke<RuntimeSnapshot>("start_stack");
    state.snapshot = snapshot;
    renderSnapshot(snapshot);
    if (snapshot.ready) {
      await openChatAndCloseShell();
    }
  } catch (error) {
    renderError(error instanceof Error ? error.message : String(error));
    await fetchSnapshot().catch(() => null);
  } finally {
    setBusy(false);
  }
}

async function stopStack() {
  setBusy(true, "Arret");
  renderError("");
  try {
    const snapshot = await invoke<RuntimeSnapshot>("stop_stack");
    state.snapshot = snapshot;
    renderSnapshot(snapshot);
  } catch (error) {
    renderError(error instanceof Error ? error.message : String(error));
  } finally {
    setBusy(false);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  launchBtn?.addEventListener("click", () => {
    void startStack("Demarrage");
  });

  retryBtn?.addEventListener("click", () => {
    void startStack("Relance");
  });

  openBtn?.addEventListener("click", () => {
    void openChatAndCloseShell().catch((error) => {
      renderError(error instanceof Error ? error.message : String(error));
    });
  });

  refreshBtn?.addEventListener("click", () => {
    setBusy(true, "Actualisation");
    renderError("");
    fetchSnapshot()
      .catch((error) => {
        renderError(error instanceof Error ? error.message : String(error));
      })
      .finally(() => setBusy(false));
  });

  stopBtn?.addEventListener("click", () => {
    void stopStack();
  });

  logsBtn?.addEventListener("click", () => {
    invoke("open_logs_directory").catch((error) => {
      renderError(error instanceof Error ? error.message : String(error));
    });
  });

  setBusy(true, "Detection");
  try {
    const snapshot = await fetchSnapshot();
    if (snapshot.ready) {
      await openChatAndCloseShell();
      return;
    }
    await startStack("Demarrage");
  } catch (error) {
    renderError(error instanceof Error ? error.message : String(error));
  } finally {
    setBusy(false);
  }
});
