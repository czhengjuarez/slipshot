"use client";

import { useEffect, useRef } from "react";
import { mediaUrl } from "@/lib/media";

const API_BASE = "https://slipshot-downloads.black-unit-15bd.workers.dev";
const ACCESS_CODE_KEY = "slipshot_saved_code";

const BOOT_LINES = [
	"Initializing Tenddrome interface...",
	"Establishing archive node connection...",
	"Slipshot system detected.",
	"Scanning recovered records...",
	"Archive fragment located: Slipshot Vol. 1.0",
	"Classification: Observation Priority",
	"Access level: Restricted",
];

export default function UnlockPage() {
	const rootRef = useRef<HTMLDivElement>(null);
	const coverUrl = mediaUrl("unlock/abf1100d-8939-40f9-a28a-6313b385148e.jpg");

	useEffect(() => {
		const root = rootRef.current;
		if (!root) return;

		const lines = root.querySelectorAll<HTMLDivElement>(".boot-line");
		const unlockEl = root.querySelector<HTMLDivElement>("#bundle-unlock");
		const codeInput = root.querySelector<HTMLInputElement>("#bundle-code");
		const submitBtn = root.querySelector<HTMLButtonElement>("#bundle-submit");
		const lockedHelpEl = root.querySelector<HTMLDivElement>("#bundle-locked-help");
		const messageEl = root.querySelector<HTMLDivElement>("#bundle-message");
		const resultsEl = root.querySelector<HTMLDivElement>("#bundle-results");

		if (!unlockEl || !codeInput || !submitBtn || !messageEl || !resultsEl) return;

		let index = 0;
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		function showUnlock() {
			unlockEl!.classList.add("is-visible");
		}

		function showNextLine() {
			if (index < lines.length) {
				lines[index].classList.add("is-visible");
				index++;
				setTimeout(showNextLine, 200);
			} else {
				showUnlock();
				maybeAutoUnlock();
			}
		}

		if (reduceMotion) {
			lines.forEach((line) => line.classList.add("is-visible"));
			showUnlock();
			maybeAutoUnlock();
		} else {
			showNextLine();
		}

		function getSavedCode() {
			try {
				return localStorage.getItem(ACCESS_CODE_KEY) || "";
			} catch {
				return "";
			}
		}

		function saveCode(code: string) {
			try {
				localStorage.setItem(ACCESS_CODE_KEY, code);
			} catch {
				/* ignore */
			}
		}

		function clearSavedCode() {
			try {
				localStorage.removeItem(ACCESS_CODE_KEY);
			} catch {
				/* ignore */
			}
		}

		function maybeAutoUnlock() {
			const savedCode = getSavedCode();
			if (!savedCode) return;
			codeInput!.value = savedCode;
			unlockBundle(savedCode, true);
		}

		function escapeHtml(value: unknown) {
			return String(value)
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#39;");
		}

		function escapeAttribute(value: unknown) {
			return escapeHtml(value);
		}

		async function unlockBundle(passedCode: string | null = null, isAuto = false) {
			const code = (passedCode || codeInput!.value).trim().toUpperCase();

			if (!code) {
				messageEl!.textContent = "Enter an authorization code.";
				return;
			}

			messageEl!.textContent = isAuto ? "Restoring saved access..." : "Verifying authorization...";
			resultsEl!.innerHTML = "";
			submitBtn!.disabled = true;

			try {
				const res = await fetch(`${API_BASE}/api/unlock`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ code }),
				});

				const data: any = await res.json();

				if (!res.ok || !data.ok) {
					if (isAuto) {
						clearSavedCode();
						codeInput!.value = "";
						messageEl!.textContent = "Saved access expired. Please re-enter your code.";
					} else {
						messageEl!.textContent = data.error || "Authorization failed.";
					}
					return;
				}

				saveCode(code);
				codeInput!.value = code;
				if (lockedHelpEl) lockedHelpEl.classList.add("is-hidden");
				messageEl!.textContent = isAuto
					? "Saved access restored. Archive unlocked."
					: "Authorization accepted. Archive unlocked.";

				renderUnlockedState(data, code);
			} catch {
				messageEl!.textContent = "Connection error. Please try again.";
			} finally {
				submitBtn!.disabled = false;
			}
		}

		function renderUnlockedState(data: any, code: string) {
			const streamHtml =
				data.streamFiles && data.streamFiles.length
					? `
    <div class="bundle-player-section">
      <div class="section-title">Listen Now</div>
      <div class="section-copy">
        Listen instantly in your browser, or download the files below to keep.
      </div>

      <div id="slipshot-resume-banner" class="resume-banner">
        <div class="resume-title">Continue Listening</div>
        <div id="slipshot-resume-text" class="resume-text"></div>
      </div>

      <div class="button-row">
        <button id="slipshot-start-over" type="button" class="secondary-button">
          Start from Beginning
        </button>
        <button id="slipshot-resume-button" type="button" class="secondary-button is-emphasis is-hidden">
          Resume
        </button>
        <button id="slipshot-toggle-chapters" type="button" class="secondary-button">
          Show Chapters ▼
        </button>
      </div>

      <div id="slipshot-current-track" class="current-track">
        ${escapeHtml(data.streamFiles[0].label)}
      </div>

      <audio id="slipshot-audio-player" controls preload="metadata" class="audio-player">
        <source src="${data.streamFiles[0].url}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>

      <div class="device-panel">
        <div class="device-copy">
          Your access and listening progress are remembered on this device.
        </div>
        <button id="slipshot-forget-device" type="button" class="secondary-button">
          Forget This Device
        </button>
      </div>

      <div id="slipshot-track-list" class="track-list">
        ${data.streamFiles
					.map(
						(file: any, i: number) => `
          <button
            type="button"
            class="slipshot-track-button${i === 0 ? " is-active" : ""}"
            data-track-url="${file.url}"
            data-track-label="${escapeAttribute(file.label)}"
            data-track-index="${i}"
          >
            ${escapeHtml(file.label)}
          </button>
        `
					)
					.join("")}
      </div>
    </div>
  `
					: `
    <div class="device-actions">
      <button id="slipshot-forget-device" type="button" class="secondary-button">
        Forget This Device
      </button>
    </div>
  `;

			const visibleFiles = (data.files || []).filter((file: any) => file.id !== "epub");

			const downloadsHtml = visibleFiles
				.map(
					(file: any) => `
    <p>
        <a href="${file.url}" target="_blank" rel="noopener">${escapeHtml(file.label)}</a>
        ${file.size ? `<span class="file-size">(${escapeHtml(file.size)})</span>` : ""}
    </p>
    `
				)
				.join("");

			resultsEl!.innerHTML = `
      ${streamHtml}
      <div class="bundle-download-section">
        <div class="section-title">Downloads</div>
        ${downloadsHtml}
      </div>
      <div class="help-panel">
        <div class="help-copy">
            Need help downloading or listening to your files?
        </div>
        <a href="/audio-access-guide" class="help-link">
            View the Audio Access Guide →
        </a>
        </div>
    `;

			const forgetBtn = resultsEl!.querySelector<HTMLButtonElement>("#slipshot-forget-device");
			if (forgetBtn) {
				forgetBtn.addEventListener("click", () => {
					clearSavedCode();
					messageEl!.textContent = "Saved access removed from this device.";
				});
			}

			if (data.streamFiles && data.streamFiles.length) {
				setupAudioPlayer(data.streamFiles, code);
				setupChapterToggle();
			}
		}

		function setupChapterToggle() {
			const toggleBtn = resultsEl!.querySelector<HTMLButtonElement>("#slipshot-toggle-chapters");
			const trackList = resultsEl!.querySelector<HTMLDivElement>("#slipshot-track-list");
			if (!toggleBtn || !trackList) return;

			toggleBtn.addEventListener("click", () => {
				const open = trackList.classList.contains("is-open");
				trackList.classList.toggle("is-open", !open);
				toggleBtn.textContent = open ? "Show Chapters ▼" : "Hide Chapters ▲";
			});
		}

		function setupAudioPlayer(streamFiles: any[], code: string) {
			const player = resultsEl!.querySelector<HTMLAudioElement>("#slipshot-audio-player");
			const source = player?.querySelector<HTMLSourceElement>("source");
			const currentTrack = resultsEl!.querySelector<HTMLDivElement>("#slipshot-current-track");
			const buttons = Array.from(resultsEl!.querySelectorAll<HTMLButtonElement>(".slipshot-track-button"));
			const startOverBtn = resultsEl!.querySelector<HTMLButtonElement>("#slipshot-start-over");
			const resumeBanner = resultsEl!.querySelector<HTMLDivElement>("#slipshot-resume-banner");
			const resumeText = resultsEl!.querySelector<HTMLDivElement>("#slipshot-resume-text");
			const resumeButton = resultsEl!.querySelector<HTMLButtonElement>("#slipshot-resume-button");
			const toggleBtn = resultsEl!.querySelector<HTMLButtonElement>("#slipshot-toggle-chapters");
			const trackList = resultsEl!.querySelector<HTMLDivElement>("#slipshot-track-list");

			if (!player || !source || !currentTrack) return;

			const STORAGE_KEY = `slipshot_audio_position_${code}`;

			let currentIndex = 0;
			let suppressTimeSave = false;
			let savedProgress: any = null;

			function formatTime(seconds: number) {
				const total = Math.max(0, Math.floor(seconds || 0));
				const mins = Math.floor(total / 60);
				const secs = total % 60;
				return `${mins}:${String(secs).padStart(2, "0")}`;
			}

			function setActiveButton(activeIndex: number) {
				buttons.forEach((btn, i) => {
					const isActive = i === activeIndex;
					btn.classList.toggle("is-active", isActive);
					const baseLabel = streamFiles[i].label;
					if (isActive) {
						btn.textContent = player!.paused ? `▶ ${baseLabel}` : `❚❚ ${baseLabel}`;
					} else {
						btn.textContent = baseLabel;
					}
				});
			}

			function updateResumeUI() {
				if (!savedProgress || !resumeBanner || !resumeText || !resumeButton) return;
				const label = savedProgress.label || streamFiles[savedProgress.index]?.label || "Saved chapter";
				const time = formatTime(savedProgress.time || 0);
				resumeText.textContent = `${label} at ${time}`;
				resumeBanner.classList.add("is-visible");
				resumeButton.classList.remove("is-hidden");
			}

			function saveProgress() {
				if (suppressTimeSave) return;
				const payload = {
					index: currentIndex,
					url: source!.src,
					time: player!.currentTime || 0,
					label: currentTrack!.textContent || "",
					savedAt: Date.now(),
				};
				try {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
					savedProgress = payload;
					updateResumeUI();
				} catch {
					/* ignore */
				}
			}

			function loadTrack(loadIndex: number, autoplay = false, resumeTime = 0) {
				const file = streamFiles[loadIndex];
				if (!file) return;

				currentIndex = loadIndex;
				suppressTimeSave = true;

				source!.src = file.url;
				currentTrack!.textContent = file.label;
				player!.load();

				const onLoadedMetadata = () => {
					if (resumeTime && Number.isFinite(resumeTime)) {
						try {
							player!.currentTime = resumeTime;
						} catch {
							/* ignore */
						}
					}

					if (autoplay) {
						player!.play().catch(() => setActiveButton(loadIndex));
					} else {
						setActiveButton(loadIndex);
					}

					saveProgress();
					suppressTimeSave = false;
					player!.removeEventListener("loadedmetadata", onLoadedMetadata);
				};

				player!.addEventListener("loadedmetadata", onLoadedMetadata);
			}

			buttons.forEach((button, btnIndex) => {
				button.addEventListener("click", () => {
					const isCurrentTrack = btnIndex === currentIndex;
					const isLoadedTrack = source!.src === streamFiles[btnIndex].url;

					if (isCurrentTrack && isLoadedTrack) {
						if (player!.paused) {
							player!.play().catch(() => {});
						} else {
							player!.pause();
						}
						return;
					}

					loadTrack(btnIndex, true, 0);

					if (trackList && !trackList.classList.contains("is-open")) {
						trackList.classList.add("is-open");
						if (toggleBtn) toggleBtn.textContent = "Hide Chapters ▲";
					}
				});
			});

			startOverBtn?.addEventListener("click", () => {
				localStorage.removeItem(STORAGE_KEY);
				savedProgress = null;
				resumeBanner?.classList.remove("is-visible");
				resumeButton?.classList.add("is-hidden");
				loadTrack(0, true, 0);
			});

			resumeButton?.addEventListener("click", () => {
				if (!savedProgress) return;
				loadTrack(savedProgress.index || 0, true, savedProgress.time || 0);
			});

			player.addEventListener("play", () => setActiveButton(currentIndex));
			player.addEventListener("pause", () => {
				setActiveButton(currentIndex);
				saveProgress();
			});
			player.addEventListener("timeupdate", () => saveProgress());
			player.addEventListener("ended", () => {
				const nextIndex = currentIndex + 1;
				if (nextIndex < streamFiles.length) {
					loadTrack(nextIndex, true, 0);
				} else {
					setActiveButton(currentIndex);
					saveProgress();
				}
			});

			try {
				const raw = localStorage.getItem(STORAGE_KEY);
				if (raw) {
					savedProgress = JSON.parse(raw);
					const savedIndex = Number.isInteger(savedProgress.index) ? savedProgress.index : 0;
					const savedTime = typeof savedProgress.time === "number" ? savedProgress.time : 0;
					updateResumeUI();
					if (savedIndex >= 0 && savedIndex < streamFiles.length) {
						loadTrack(savedIndex, false, savedTime);
						return;
					}
				}
			} catch {
				/* ignore */
			}

			setActiveButton(0);
			saveProgress();
		}

		submitBtn.addEventListener("click", () => unlockBundle());
		codeInput.addEventListener("keydown", (event) => {
			if (event.key === "Enter") unlockBundle();
		});
	}, []);

	return (
		<div ref={rootRef} style={{ padding: "var(--space-8)" }}>
			<style>{`
        #tenddrome-terminal {
          background: #141414;
          color: #e6e6e6;
          font-family: monospace;
          padding: 30px;
          border-radius: 8px;
          max-width: 700px;
          text-align: left !important;
          line-height: 1.5;
          letter-spacing: 0.02em;
          box-sizing: border-box;
        }
        #tenddrome-terminal p, #tenddrome-terminal div, #tenddrome-terminal label {
          text-align: left !important;
        }
        .boot-line { opacity: 0; margin-bottom: 6px; color: #e13896; transition: opacity 0.3s; }
        .boot-line.is-visible { opacity: 1; }
        #bundle-unlock { display: none; margin-top: 20px; }
        #bundle-unlock.is-visible { display: block; }
        #bundle-code {
          margin-top: 10px; padding: 8px; font-size: 16px; background: #111;
          border: 1px solid #e13896; color: #fff; box-sizing: border-box;
        }
        #bundle-code:focus { outline: none; box-shadow: 0 0 0 1px #e13896; }
        #bundle-submit {
          padding: 8px 16px; margin-left: 6px; cursor: pointer;
          background: #e13896; border: none; color: #fff; font-weight: bold;
        }
        #bundle-submit:hover { opacity: 0.9; }
        #bundle-results a { color: #e13896; text-decoration: none; }
        #bundle-results a:hover { text-decoration: underline; }
        .cursor {
          display: inline-block; width: 10px; height: 1em; background: #e13896;
          margin-left: 5px; vertical-align: text-bottom; animation: unlock-blink 1s infinite;
        }
        @keyframes unlock-blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }
        .file-size { opacity: 0.65; margin-left: 6px; font-size: 0.9em; }
        #bundle-message { margin-top: 12px; }
        #bundle-results { margin-top: 16px; }
        .bundle-player-section { margin-bottom: 28px; }
        .section-title { font-weight: 600; margin-bottom: 10px; }
        .section-copy { margin-bottom: 14px; }
        .resume-banner {
          display: none; margin-bottom: 12px; padding: 10px 12px;
          border: 1px solid #444; background: #1a1a1a; border-radius: 6px;
        }
        .resume-banner.is-visible { display: block; }
        .resume-title { font-weight: 600; margin-bottom: 4px; }
        .resume-text { opacity: 0.85; font-size: 0.95em; }
        .button-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
        .secondary-button {
          padding: 8px 12px; border: 1px solid #444; background: #1a1a1a;
          color: #fff; cursor: pointer; border-radius: 6px;
        }
        .secondary-button.is-emphasis { background: #2a2a2a; }
        .secondary-button.is-hidden { display: none; }
        .current-track { font-weight: 500; margin-bottom: 8px; }
        .audio-player { width: 100%; margin-bottom: 16px; }
        .device-panel {
          margin-bottom: 14px; padding: 10px 12px; border: 1px solid #333;
          background: #181818; border-radius: 6px;
        }
        .device-copy { opacity: 0.8; font-size: 0.9em; margin-bottom: 8px; }
        .track-list { display: none; flex-direction: column; gap: 8px; }
        .track-list.is-open { display: flex; }
        .slipshot-track-button {
          text-align: left; padding: 10px 12px; border: 1px solid #444;
          background: #1a1a1a; color: #fff; cursor: pointer; border-radius: 6px;
        }
        .slipshot-track-button.is-active { background: #2a2a2a; }
        .device-actions { margin-bottom: 16px; }
        .help-panel { margin-top: 20px; padding-top: 12px; border-top: 1px solid #333; }
        .help-copy { margin-bottom: 6px; }
        .help-link { color: #e13896; text-decoration: none; font-weight: 500; }
        .locked-help { margin-top: 12px; font-size: 0.9em; opacity: 0.8; }
        .locked-help.is-hidden { display: none; }
        .locked-help-link { color: #e13896; text-decoration: none; }
        @media (max-width: 600px) {
          #tenddrome-terminal { padding: 20px; }
          #bundle-code, #bundle-submit { display: block; width: 100%; margin: 10px 0 0 0; box-sizing: border-box; }
        }
        @media (prefers-reduced-motion: reduce) {
          .boot-line { opacity: 1 !important; }
          .cursor { animation: none; }
        }
      `}</style>

			<h1
				style={{
					fontFamily: "var(--font-display)",
					fontSize: "var(--text-xl)",
					textTransform: "uppercase",
					color: "#fff",
					marginBottom: "var(--space-6)",
				}}
			>
				// NODE ACCESS: you have been authorized //
			</h1>

			<div style={{ display: "flex", gap: "var(--space-8)", flexWrap: "wrap" }}>
				<div style={{ flex: "1 1 500px" }}>
					<div id="tenddrome-terminal">
						<div id="boot-sequence">
							{BOOT_LINES.map((line) => (
								<div className="boot-line" key={line}>
									{line}
								</div>
							))}
							<div className="boot-line">
								Awaiting authorization code... <span className="cursor" />
							</div>
						</div>

						<div id="bundle-unlock">
							<p>
								A secured archive fragment has been recovered from the Slipshot network. Contained within this
								bundle are the primary narrative records of <strong>Slipshot Vol. 1.0</strong>, including the full
								audiobook transmission.
							</p>

							<label htmlFor="bundle-code">Authorization Code</label>
							<br />

							<input
								id="bundle-code"
								maxLength={6}
								placeholder="ENTER YOUR CODE"
								autoCapitalize="characters"
								autoComplete="off"
								autoCorrect="off"
								spellCheck={false}
								inputMode="text"
							/>
							<button id="bundle-submit" type="button">
								Unlock Archive
							</button>

							<div id="bundle-locked-help" className="locked-help">
								Having trouble accessing this archive?{" "}
								<a href="/audio-access-help" className="locked-help-link">
									View Access Instructions →
								</a>
							</div>

							<div id="bundle-message" />
							<div id="bundle-results" />
						</div>
					</div>
				</div>

				{coverUrl && (
					<div style={{ flex: "0 1 300px" }}>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={coverUrl}
							alt="Cover of novel depicting character walking forward"
							style={{ width: "100%", display: "block" }}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
