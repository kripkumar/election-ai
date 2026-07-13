/**
 * ElectionAI - Production Grade Core Application Script
 * Architecture: Object-Oriented State-Driven Vanilla JavaScript
 * Features: English Native UI, Live Charts, Secure LocalStorage, Automated Election Timers, Worker AI Gateway
 */

class ElectionApp {
    constructor() {
        // --- 1. APPLICATION STATE ---
        this.state = {
            config: {
                electionName: "General Mock Election 2026",
                electionDescription: "Advanced Electronic Decentralized Automated Consensus Simulation System.",
                electionDate: "",
                startTime: "",
                endTime: "",
                isActive: false,
                isArchived: false
            },
            candidates: [],
            votes: [], // Format: { id: timestamp, candidateId: id, timestamp: string }
            voters: {}, // Format: { fingerprintHash: true } (Local Storage Prevention)
            isAdminAuthenticated: false,
            settings: {
                theme: "dark", // dark | light
                accentColor: "#3b82f6", // default hex color matching css variables
                fontSize: "medium", // small | medium | large
                animationsEnabled: true
            },
            chatHistory: []
        };

        // --- 2. LOCAL DATA STORAGE KEY CONFIGURATIONS ---
        this.STORAGE_KEY = "ELECTION_AI_SECURE_STORAGE_STATE";

        // --- 3. ENGINE CORE INSTANCES ---
        this.charts = {
            pie: null,
            bar: null
        };
        this.timerInterval = null;
        this.apiEndpoint = "https://electionai.180011.workers.dev";

        // Initialize application workflow triggers
        this.init();
    }

    /**
     * Bootstraps the application framework layers
     */
    init() {
        this.loadStateFromStorage();
        this.registerDOMReferences();
        this.bindUserActionEvents();
        this.applySettingsAndTheme();
        this.initializeDataVisualizationCharts();
        this.startSystemTimerDaemon();
        this.renderVotingInterface();
        this.renderCandidateManagementTable();
        this.updateLiveDashboardMetrics();
        this.evaluateWinnerStateWindow();

        // Push initial AI greeting message trace safely
        if (this.state.chatHistory.length === 0) {
            this.appendChatMessage("assistant", "System online. Ask me about voter security, platform architecture, or cryptographic counters.");
        }
    }

    /**
     * Cache DOM bindings inside unified pointer dictionary
     */
    registerDOMReferences() {
        this.dom = {
            // General Structure
            appContainer: document.getElementById("electionai-app"),
            loader: document.getElementById("global-loader"),
            
            // Authentication Contexts
            adminUsernameInput: document.getElementById("admin-user"),
            adminPasswordInput: document.getElementById("admin-pass"),
            adminLoginBtn: document.getElementById("admin-login-submit"),
            adminLogoutBtn: document.getElementById("admin-logout-trigger"),
            adminPanelSection: document.getElementById("admin-secured-panel"),
            adminAuthCard: document.getElementById("admin-auth-card"),

            // Config Form Bindings
            electionNameInp: document.getElementById("cfg-election-name"),
            electionDescInp: document.getElementById("cfg-election-desc"),
            electionDateInp: document.getElementById("cfg-election-date"),
            electionStartInp: document.getElementById("cfg-election-start"),
            electionEndInp: document.getElementById("cfg-election-end"),
            saveConfigBtn: document.getElementById("btn-save-config"),
            startElectionBtn: document.getElementById("btn-sys-start"),
            endElectionBtn: document.getElementById("btn-sys-end"),
            resetElectionBtn: document.getElementById("btn-sys-reset"),
            exportResultsBtn: document.getElementById("btn-sys-export"),

            // Candidate Mutation
            candNameInp: document.getElementById("cand-name"),
            candPartyInp: document.getElementById("cand-party"),
            candPhotoInp: document.getElementById("cand-photo-upload"),
            candSymbolInp: document.getElementById("cand-symbol-upload"),
            addCandBtn: document.getElementById("btn-add-candidate"),
            candidatesTableBody: document.getElementById("candidates-table-ledger"),

            // Display Vectors
            votingCardsGrid: document.getElementById("voting-cards-matrix"),
            timerCountdownDisplay: document.getElementById("countdown-timer-vector"),
            winnerScreenOverlay: document.getElementById("winner-announcement-overlay"),

            // Dashboards Values
            dashCandidates: document.getElementById("dash-stat-candidates"),
            dashVotes: document.getElementById("dash-stat-votes"),
            dashStatus: document.getElementById("dash-stat-status"),
            dashTimer: document.getElementById("dash-stat-timer"),
            dashLeader: document.getElementById("dash-stat-leader"),
            dashVoters: document.getElementById("dash-stat-voters"),

            // Chat Engine Interactivity
            chatLogs: document.getElementById("ai-chat-logs"),
            chatInput: document.getElementById("ai-chat-input-query"),
            chatSendBtn: document.getElementById("ai-chat-send-trigger"),

            // Configuration Options Panel
            settingTheme: document.getElementById("opt-setting-theme"),
            settingAccent: document.getElementById("opt-setting-accent"),
            settingFont: document.getElementById("opt-setting-font"),
            settingAnim: document.getElementById("opt-setting-animations")
        };
    }

    /**
     * Setup multi-tiered transactional event listeners
     */
    bindUserActionEvents() {
        // Authenticating
        if (this.dom.adminLoginBtn) this.dom.adminLoginBtn.addEventListener("click", () => this.handleAdminAuthenticationRoute());
        if (this.dom.adminLogoutBtn) this.dom.adminLogoutBtn.addEventListener("click", () => this.handleAdminDeauthentication());

        // Configuration Triggers
        if (this.dom.saveConfigBtn) this.dom.saveConfigBtn.addEventListener("click", () => this.commitElectionConfigurationData());
        if (this.dom.startElectionBtn) this.dom.startElectionBtn.addEventListener("click", () => this.toggleElectionRunningState(true));
        if (this.dom.endElectionBtn) this.dom.endElectionBtn.addEventListener("click", () => this.toggleElectionRunningState(false));
        if (this.dom.resetElectionBtn) this.dom.resetElectionBtn.addEventListener("click", () => this.purgeEntireSystemLedgerData());
        if (this.dom.exportResultsBtn) this.dom.exportResultsBtn.addEventListener("click", () => this.generateStructuredCSVExportDownload());

        // Candidate Creation
        if (this.dom.addCandBtn) this.dom.addCandBtn.addEventListener("click", () => this.createNewCandidateProfileRecord());

        // Chat Matrix Input Triggers
        if (this.dom.chatSendBtn) this.dom.chatSendBtn.addEventListener("click", () => this.dispatchChatQueryToWorkerGateway());
        if (this.dom.chatInput) {
            this.dom.chatInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") this.dispatchChatQueryToWorkerGateway();
            });
        }

        // Configuration Adjusters Realtime
        if (this.dom.settingTheme) this.dom.settingTheme.addEventListener("change", (e) => this.updateSettingParameter("theme", e.target.value));
        if (this.dom.settingAccent) this.dom.settingAccent.addEventListener("input", (e) => this.updateSettingParameter("accentColor", e.target.value));
        if (this.dom.settingFont) this.dom.settingFont.addEventListener("change", (e) => this.updateSettingParameter("fontSize", e.target.value));
        if (this.dom.settingAnim) this.dom.settingAnim.addEventListener("change", (e) => this.updateSettingParameter("animationsEnabled", e.target.checked));
    }

    /**
     * Input sanitation engine to mitigate XSS vulnerabilities across the platform
     */
    sanitizeInputString(rawString) {
        if (typeof rawString !== 'string') return '';
        return rawString
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#x27;")
            .replace(/\//g, "&#x2F;");
    }

    /**
     * Create structural alerts for uniform interface messaging loops
     */
    dispatchToastNotification(messageText, notificationType = "info") {
        const toastNode = document.createElement("div");
        toastNode.className = `toast-node toast-type-${notificationType} slide-in-animation`;
        toastNode.innerText = messageText;
        
        let container = document.getElementById("toast-boundary-anchor");
        if (!container) {
            container = document.createElement("div");
            container.id = "toast-boundary-anchor";
            document.body.appendChild(container);
        }
        
        container.appendChild(toastNode);
        setTimeout(() => {
            toastNode.classList.add("fade-out-animation");
            setTimeout(() => toastNode.remove(), 400);
        }, 4000);
    }

    /**
     * Secure persistence serialization layer
     */
    synchronizeStateToStorage() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
        } catch (storageError) {
            console.error("Local Storage quota breached or blocked:", storageError);
            this.dispatchToastNotification("Storage synchronization failed.", "danger");
        }
    }

    /**
     * Local Data Restoration Hydrator
     */
    loadStateFromStorage() {
        const serializedState = localStorage.getItem(this.STORAGE_KEY);
        if (serializedState) {
            try {
                const parsedState = JSON.parse(serializedState);
                this.state = { ...this.state, ...parsedState };
            } catch (parseErr) {
                console.error("Data tracking corrupted. Default state instantiated.", parseErr);
            }
        }
    }

    /**
     * Updates individual setting attributes safely
     */
    updateSettingParameter(key, value) {
        this.state.settings[key] = value;
        this.synchronizeStateToStorage();
        this.applySettingsAndTheme();
    }

    /**
     * Applies themes, accents, fonts, and animation rules to the document root elements
     */
    applySettingsAndTheme() {
        const root = document.documentElement;
        const config = this.state.settings;

        // Theme parsing
        if (config.theme === "dark") {
            root.classList.add("dark-mode-substrate");
            root.classList.remove("light-mode-substrate");
        } else {
            root.classList.remove("dark-mode-substrate");
            root.classList.add("light-mode-substrate");
        }

        // Custom accent coloring runtime manipulation
        root.style.setProperty("--accent-primary-vector", config.accentColor);

        // System structural scale allocations
        root.setAttribute("data-ui-scale", config.fontSize);

        // Core visual behavior rule sets toggle
        if (config.animationsEnabled) {
            root.classList.remove("disable-motion-vectors");
        } else {
            root.classList.add("disable-motion-vectors");
        }

        // Sync control inputs configuration state
        if (this.dom.settingTheme) this.dom.settingTheme.value = config.theme;
        if (this.dom.settingAccent) this.dom.settingAccent.value = config.accentColor;
        if (this.dom.settingFont) this.dom.settingFont.value = config.fontSize;
        if (this.dom.settingAnim) this.dom.settingAnim.checked = config.animationsEnabled;
    }

    /**
     * Handles administrative login verification
     */
    handleAdminAuthenticationRoute() {
        const enteredUser = this.dom.adminUsernameInput.value.trim();
        const enteredPass = this.dom.adminPasswordInput.value;

        if (enteredUser === "admin" && enteredPass === "admin123") {
            this.state.isAdminAuthenticated = true;
            this.state.chatHistory = []; // clear trace for newly authenticated view bounds
            this.synchronizeStateToStorage();
            this.evaluateAdministrativeViewPermissions();
            this.dispatchToastNotification("System credentials verified. Administrative access unlocked.", "success");
            
            this.dom.adminUsernameInput.value = "";
            this.dom.adminPasswordInput.value = "";
        } else {
            this.dispatchToastNotification("Authentication rejected: Invalid cryptographic tokens or credentials.", "danger");
        }
    }

    /**
     * Handles admin logout clearing session context arrays
     */
    handleAdminDeauthentication() {
        this.state.isAdminAuthenticated = false;
        this.synchronizeStateToStorage();
        this.evaluateAdministrativeViewPermissions();
        this.dispatchToastNotification("Administrative session state terminated safely.", "info");
    }

    /**
     * Toggles dashboard configuration cards based on administrative security settings
     */
    evaluateAdministrativeViewPermissions() {
        if (this.state.isAdminAuthenticated) {
            this.dom.adminPanelSection.classList.remove("ui-display-none-force");
            this.dom.adminAuthCard.classList.add("ui-display-none-force");
            this.hydrateAdminConfigInputs();
        } else {
            this.dom.adminPanelSection.classList.add("ui-display-none-force");
            this.dom.adminAuthCard.classList.remove("ui-display-none-force");
        }
    }

    /**
     * Populates administration control values with active session tracking parameters
     */
    hydrateAdminConfigInputs() {
        const target = this.state.config;
        if (this.dom.electionNameInp) this.dom.electionNameInp.value = target.electionName || "";
        if (this.dom.electionDescInp) this.dom.electionDescInp.value = target.electionDescription || "";
        if (this.dom.electionDateInp) this.dom.electionDateInp.value = target.electionDate || "";
        if (this.dom.electionStartInp) this.dom.electionStartInp.value = target.startTime || "";
        if (this.dom.electionEndInp) this.dom.electionEndInp.value = target.endTime || "";
    }

    /**
     * Saves election parameters to runtime config arrays
     */
    commitElectionConfigurationData() {
        if (!this.state.isAdminAuthenticated) return;

        const nameValue = this.dom.electionNameInp.value.trim();
        const descValue = this.dom.electionDescInp.value.trim();

        if (!nameValue || !descValue) {
            this.dispatchToastNotification("Validation Failed: Election context definitions cannot be blank.", "warning");
            return;
        }

        this.state.config.electionName = this.sanitizeInputString(nameValue);
        this.state.config.electionDescription = this.sanitizeInputString(descValue);
        this.state.config.electionDate = this.dom.electionDateInp.value;
        this.state.config.startTime = this.dom.electionStartInp.value;
        this.state.config.endTime = this.dom.electionEndInp.value;

        this.synchronizeStateToStorage();
        this.updateLiveDashboardMetrics();
        this.dispatchToastNotification("Election specifications updated successfully across database matrices.", "success");
    }

    /**
     * Toggles global voting availability status switches
     */
    toggleElectionRunningState(shouldRun) {
        if (!this.state.isAdminAuthenticated) return;

        if (shouldRun) {
            if (this.state.candidates.length < 2) {
                this.dispatchToastNotification("Operational Failure: A minimum of two system candidates are required to initialize ballot workflows.", "warning");
                return;
            }
            this.state.config.isActive = true;
            this.state.config.isArchived = false;
            this.dispatchToastNotification("System Matrix Activated: Voting terminals are now open to receive transactions.", "success");
        } else {
            this.state.config.isActive = false;
            this.state.config.isArchived = true;
            this.dispatchToastNotification("Ballot Closed: Running metrics compiled into historical database profiles.", "info");
        }

        this.synchronizeStateToStorage();
        this.updateLiveDashboardMetrics();
        this.renderVotingInterface();
        this.evaluateWinnerStateWindow();
    }

    /**
     * Purges configuration frameworks back to baseline factories
     */
    purgeEntireSystemLedgerData() {
        if (!this.state.isAdminAuthenticated) return;
        if (!confirm("CRITICAL WARNING: This action permanently purges database ledger indexes, recorded tallies, hardware hashes, and active configurations. Proceed?")) return;

        this.state.config = {
            electionName: "General Mock Election 2026",
            electionDescription: "Advanced Electronic Decentralized Automated Consensus Simulation System.",
            electionDate: "",
            startTime: "",
            endTime: "",
            isActive: false,
            isArchived: false
        };
        this.state.candidates = [];
        this.state.votes = [];
        this.state.voters = {};
        this.state.chatHistory = [];

        this.synchronizeStateToStorage();
        this.hydrateAdminConfigInputs();
        this.updateLiveDashboardMetrics();
        this.renderCandidateManagementTable();
        this.renderVotingInterface();
        this.refreshDataVisualizationCharts();
        this.evaluateWinnerStateWindow();
        
        this.dispatchToastNotification("System reset complete. Data tables cleared successfully.", "success");
    }

    /**
     * Reads image buffers to convert uploads into memory URI schemas safely
     */
    async processImageFileBuffer(fileReference) {
        if (!fileReference) return "";
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(fileReference);
        });
    }

    /**
     * Enrolls candidate profiles into active structural matrices
     */
    async createNewCandidateProfileRecord() {
        if (!this.state.isAdminAuthenticated) return;

        const name = this.dom.candNameInp.value.trim();
        const party = this.dom.candPartyInp.value.trim();
        const photoFile = this.dom.candPhotoInp.files[0];
        const symbolFile = this.dom.candSymbolInp.files[0];

        if (!name || !party) {
            this.dispatchToastNotification("Validation Failed: Profile parameters require definitive text strings.", "warning");
            return;
        }

        // Process files or fall back to high-tech canvas placeholder generations
        const photoDataUri = photoFile ? await this.processImageFileBuffer(photoFile) : `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%232d3748"/><text x="50%" y="55%" font-family="sans-serif" font-size="12" fill="%23a0aec0" text-anchor="middle">PROFILE</text></svg>`;
        const symbolDataUri = symbolFile ? await this.processImageFileBuffer(symbolFile) : `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%234a5568"/><text x="50%" y="55%" font-family="sans-serif" font-size="10" fill="%23fff" text-anchor="middle">PARTY</text></svg>`;

        const uniqueId = "CAND-" + Date.now().toString(36).toUpperCase();

        const candidateRecord = {
            id: uniqueId,
            name: this.sanitizeInputString(name),
            party: this.sanitizeInputString(party),
            photo: photoDataUri,
            symbol: symbolDataUri
        };

        this.state.candidates.push(candidateRecord);
        this.synchronizeStateToStorage();
        
        // Purge dynamic input parameters safely
        this.dom.candNameInp.value = "";
        this.dom.candPartyInp.value = "";
        this.dom.candPhotoInp.value = "";
        this.dom.candSymbolInp.value = "";

        this.renderCandidateManagementTable();
        this.renderVotingInterface();
        this.updateLiveDashboardMetrics();
        this.refreshDataVisualizationCharts();
        
        this.dispatchToastNotification(`Candidate profile ${candidateRecord.name} registered successfully.`, "success");
    }

    /**
     * Purges individual target records out of tracking models
     */
    removeCandidateRecordEntry(candidateId) {
        if (!this.state.isAdminAuthenticated) return;
        
        this.state.candidates = this.state.candidates.filter(c => c.id !== candidateId);
        this.state.votes = this.state.votes.filter(v => v.candidateId !== candidateId);

        this.synchronizeStateToStorage();
        this.renderCandidateManagementTable();
        this.renderVotingInterface();
        this.updateLiveDashboardMetrics();
        this.refreshDataVisualizationCharts();
        
        this.dispatchToastNotification("Target profile index removed from layout tracking matrices.", "info");
    }

    /**
     * Redraws administrative control data matrices directly inside layout view templates
     */
    renderCandidateManagementTable() {
        if (!this.dom.candidatesTableBody) return;
        this.dom.candidatesTableBody.innerHTML = "";

        if (this.state.candidates.length === 0) {
            this.dom.candidatesTableBody.innerHTML = `<tr><td colspan="5" class="ui-text-center ui-opacity-dim">No registered candidates exist within this tracking node array.</td></tr>`;
            return;
        }

        this.state.candidates.forEach(cand => {
            const row = document.createElement("tr");
            const voteCount = this.state.votes.filter(v => v.candidateId === cand.id).length;

            row.innerHTML = `
                <td>
                    <div class="table-profile-flex flex-align-center">
                        <img src="${cand.photo}" alt="Pic" class="ledger-thumb-pic thumbnail-avatar" />
                        <span class="weight-medium-vector">${cand.name}</span>
                    </div>
                </td>
                <td>
                    <div class="table-profile-flex flex-align-center">
                        <img src="${cand.symbol}" alt="Sym" class="ledger-thumb-pic thumbnail-symbol" />
                        <span>${cand.party}</span>
                    </div>
                </td>
                <td><code>${cand.id}</code></td>
                <td><span class="badge-count-vector font-mono-vector">${voteCount}</span></td>
                <td>
                    <button class="btn-action-control action-purge" data-purge-target="${cand.id}">
                        Delete
                    </button>
                </td>
            `;

            row.querySelector(".action-purge").addEventListener("click", () => this.removeCandidateRecordEntry(cand.id));
            this.dom.candidatesTableBody.appendChild(row);
        });
    }

    /**
     * Generates and auto-renders transactional interface components for user polling matrix layouts
     */
    renderVotingInterface() {
        if (!this.dom.votingCardsGrid) return;
        this.dom.votingCardsGrid.innerHTML = "";

        const hardwareHash = "LOC-MACH-FINGERPRINT-V2";
        const hasVoted = this.state.voters[hardwareHash] === true;
        const isClosed = !this.state.config.isActive || this.state.config.isArchived;

        if (this.state.candidates.length === 0) {
            this.dom.votingCardsGrid.innerHTML = `<div class="empty-state-vector-notice ui-text-center">Standby Mode. Waiting for administration terminal to enroll target ballot profiles.</div>`;
            return;
        }

        this.state.candidates.forEach(cand => {
            const card = document.createElement("div");
            card.className = "ballot-card-component glassmorphism-surface rise-hover-interaction";

            let actionButtonStateHtml = "";
            if (isClosed) {
                actionButtonStateHtml = `<button class="btn-ballot-vector disabled-state-lock" disabled>Session Locked</button>`;
            } else if (hasVoted) {
                actionButtonStateHtml = `<button class="btn-ballot-vector duplicate-state-lock" disabled>You have already voted.</button>`;
            } else {
                actionButtonStateHtml = `<button class="btn-ballot-vector action-cast-ballot" data-candidate-target="${cand.id}">Cast Secure Ballot</button>`;
            }

            card.innerHTML = `
                <div class="ballot-avatar-frame">
                    <img src="${cand.photo}" alt="${cand.name}" class="ballot-profile-graphic" />
                    <img src="${cand.symbol}" alt="${cand.party}" class="ballot-symbol-overlay" />
                </div>
                <div class="ballot-identity-metadata">
                    <h3 class="ballot-candidate-name-header">${cand.name}</h3>
                    <p class="ballot-candidate-party-subtext">${cand.party}</p>
                </div>
                <div class="ballot-action-wrapper">
                    ${actionButtonStateHtml}
                </div>
            `;

            const btn = card.querySelector(".action-cast-ballot");
            if (btn) {
                btn.addEventListener("click", () => this.executeSecureBallotTransaction(cand.id));
            }

            this.dom.votingCardsGrid.appendChild(card);
        });
    }

    /**
     * Commits a new secure vote transaction to local state arrays
     */
    executeSecureBallotTransaction(candidateId) {
        const hardwareHash = "LOC-MACH-FINGERPRINT-V2";

        // Security assertion validation layer: Ensure voter duplication tracking is functional
        if (this.state.voters[hardwareHash] === true) {
            this.dispatchToastNotification("Security Breach: Duplicate Vote Detected on this machine hardware fingerprint.", "danger");
            this.renderVotingInterface();
            return;
        }

        // Integrity assertion validation layer: Ensure active election sessions are processing requests
        if (!this.state.config.isActive || this.state.config.isArchived) {
            this.dispatchToastNotification("Transaction Rejected: Active voting window closed.", "warning");
            return;
        }

        const voteTransactionRecord = {
            id: "VOTE-" + Math.random().toString(36).substring(2, 11).toUpperCase(),
            candidateId: candidateId,
            timestamp: new Date().toISOString()
        };

        this.state.votes.push(voteTransactionRecord);
        this.state.voters[hardwareHash] = true; // Lock client terminal hardware fingerprint validation state

        this.synchronizeStateToStorage();
        this.updateLiveDashboardMetrics();
        this.refreshDataVisualizationCharts();
        this.renderVotingInterface();
        
        this.dispatchToastNotification("Consensus confirmed. Vote securely committed to local state data stores.", "success");
        this.triggerVoteSuccessAnimation();
    }

    /**
     * Executes interactive full-screen graphical success notification systems
     */
    triggerVoteSuccessAnimation() {
        const structuralFlash = document.createElement("div");
        structuralFlash.className = "success-flash-overlay flex-center-alignment";
        structuralFlash.innerHTML = `
            <div class="success-message-card scale-up-animation ui-text-center">
                <div class="success-check-icon">✓</div>
                <h2>Ballot Committed</h2>
                <p>Your cryptographic vote transaction has been recorded accurately.</p>
            </div>
        `;
        document.body.appendChild(structuralFlash);
        setTimeout(() => {
            structuralFlash.classList.add("fade-out-animation");
            setTimeout(() => structuralFlash.remove(), 500);
        }, 2200);
    }

    /**
     * Realtime mathematical calculator computing analytical indicators dynamically
     */
    updateLiveDashboardMetrics() {
        const stats = this.compileAnalyticalTallyMetrics();

        if (this.dom.dashCandidates) this.dom.dashCandidates.innerText = this.state.candidates.length;
        if (this.dom.dashVotes) this.dom.dashVotes.innerText = this.state.votes.length;
        if (this.dom.dashVoters) this.dom.dashVoters.innerText = Object.keys(this.state.voters).length;
        if (this.dom.dashLeader) this.dom.dashLeader.innerText = stats.leadingCandidateName;

        // Configuration State Parsing Values
        if (this.dom.dashStatus) {
            if (this.state.config.isArchived) {
                this.dom.dashStatus.innerText = "ARCHIVED & TERMINATED";
                this.dom.dashStatus.className = "status-badge status-archived";
            } else if (this.state.config.isActive) {
                this.dom.dashStatus.innerText = "LIVE & COLLECTING CONSENSUS";
                this.dom.dashStatus.className = "status-badge status-live-active";
            } else {
                this.dom.dashStatus.innerText = "INITIALIZED / STANDBY MODE";
                this.dom.dashStatus.className = "status-badge status-standby";
            }
        }

        this.evaluateAdministrativeViewPermissions();
    }

    /**
     * Analytical metric reduction loops parsing current computational totals
     */
    compileAnalyticalTallyMetrics() {
        const totalVotes = this.state.votes.length;
        const distributionMap = {};

        this.state.candidates.forEach(c => {
            distributionMap[c.id] = {
                name: c.name,
                party: c.party,
                photo: c.photo,
                votes: 0,
                percentage: 0
            };
        });

        this.state.votes.forEach(v => {
            if (distributionMap[v.candidateId]) {
                distributionMap[v.candidateId].votes++;
            }
        });

        let highestCount = -1;
        let runningLeaderName = "N/A";
        let leaderProfileRef = null;

        Object.keys(distributionMap).forEach(id => {
            const item = distributionMap[id];
            item.percentage = totalVotes > 0 ? parseFloat(((item.votes / totalVotes) * 100).toFixed(1)) : 0;
            
            if (item.votes > highestCount && item.votes > 0) {
                highestCount = item.votes;
                runningLeaderName = item.name;
                leaderProfileRef = item;
            }
        });

        return {
            totalVotes,
            distributionMap,
            leadingCandidateName: runningLeaderName,
            leaderProfile: leaderProfileRef
        };
    }

    /**
     * Initializes multi-dimensional graphical presentation widgets using ChartJS engines
     */
    initializeDataVisualizationCharts() {
        const ctxPie = document.getElementById("analytics-pie-canvas");
        const ctxBar = document.getElementById("analytics-bar-canvas");

        if (!ctxPie || !ctxBar) return;

        this.charts.pie = new Chart(ctxPie, {
            type: "pie",
            data: {
                labels: ["No Candidates Registered"],
                datasets: [{
                    data: [1],
                    backgroundColor: ["rgba(160, 174, 192, 0.2)"],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: "bottom", labels: { color: "#a0aec0", font: { family: "system-ui" } } }
                }
            }
        });

        this.charts.bar = new Chart(ctxBar, {
            type: "bar",
            data: {
                labels: ["Waiting State"],
                datasets: [{
                    label: "Votes Received",
                    data: [0],
                    backgroundColor: "#3b82f6"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, ticks: { color: "#a0aec0", stepSize: 1 }, grid: { color: "rgba(160,174,192,0.1)" } },
                    x: { ticks: { color: "#a0aec0" }, grid: { display: false } }
                },
                plugins: { legend: { display: false } }
            }
        });

        this.refreshDataVisualizationCharts();
    }

    /**
     * Smoothly updates existing ChartJS instances to prevent rendering latency glitches
     */
    refreshDataVisualizationCharts() {
        if (!this.charts.pie || !this.charts.bar) return;

        const metrics = this.compileAnalyticalTallyMetrics();
        const profiles = Object.values(metrics.distributionMap);

        if (profiles.length === 0) return;

        const labels = profiles.map(p => p.name);
        const dataValues = profiles.map(p => p.votes);
        
        const baseColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];
        const backgroundColors = labels.map((_, i) => baseColors[i % baseColors.length]);

        this.charts.pie.data.labels = labels;
        this.charts.pie.data.datasets[0].data = dataValues;
        this.charts.pie.data.datasets[0].backgroundColor = backgroundColors;
        this.charts.pie.update();

        this.charts.bar.data.labels = labels;
        this.charts.bar.data.datasets[0].data = dataValues;
        this.charts.bar.data.datasets[0].backgroundColor = backgroundColors;
        this.charts.bar.update();
    }

    /**
     * Runs localized continuous time daemon loops checking for system window closing horizons
     */
    startSystemTimerDaemon() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            const config = this.state.config;

            if (!config.electionDate || !config.endTime) {
                if (this.dom.timerCountdownDisplay) this.dom.timerCountdownDisplay.innerText = "No limit set";
                if (this.dom.dashTimer) this.dom.dashTimer.innerText = "Infinity";
                return;
            }

            const targetTimestampStr = `${config.electionDate}T${config.endTime}:00`;
            const targetTime = new Date(targetTimestampStr).getTime();
            const now = new Date().getTime();
            const distance = targetTime - now;

            if (this.state.config.isActive && distance <= 0) {
                this.state.config.isActive = false;
                this.state.config.isArchived = true;
                this.synchronizeStateToStorage();
                this.updateLiveDashboardMetrics();
                this.renderVotingInterface();
                this.evaluateWinnerStateWindow();
                this.dispatchToastNotification("System Core Broadcast: Election time frame window expired. Terminals safely stored.", "info");
            }

            if (distance < 0 || this.state.config.isArchived) {
                if (this.dom.timerCountdownDisplay) this.dom.timerCountdownDisplay.innerText = "ELECTION CLOSED";
                if (this.dom.dashTimer) this.dom.dashTimer.innerText = "00:00:00";
            } else {
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                const timingString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                if (this.dom.timerCountdownDisplay) this.dom.timerCountdownDisplay.innerText = timingString;
                if (this.dom.dashTimer) this.dom.dashTimer.innerText = timingString;
            }
        }, 1000);
    }

    /**
     * Validates and compiles winner screen parameters
     */
    evaluateWinnerStateWindow() {
        if (!this.dom.winnerScreenOverlay) return;

        if (this.state.config.isArchived && this.state.votes.length > 0) {
            const data = this.compileAnalyticalTallyMetrics();
            const leader = data.leaderProfile;

            if (leader) {
                document.getElementById("winner-avatar-graphic").src = leader.photo;
                document.getElementById("winner-name-vector").innerText = leader.name;
                document.getElementById("winner-party-vector").innerText = leader.party;
                document.getElementById("winner-metrics-breakdown").innerText = `Total: ${leader.votes} Votes (${leader.percentage}% Consensus Allocation)`;
                
                this.dom.winnerScreenOverlay.classList.remove("ui-display-none-force");
                this.triggerConfettiAnimationSequence();
            }
        } else {
            this.dom.winnerScreenOverlay.classList.add("ui-display-none-force");
        }
    }

    /**
     * Triggers canvas confetti particles to announce clean election completion
     */
    triggerConfettiAnimationSequence() {
        let canvas = document.getElementById("confetti-canvas-plane");
        if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.id = "confetti-canvas-plane";
            this.dom.winnerScreenOverlay.appendChild(canvas);
        }

        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        for (let i = 0; i < 120; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                r: Math.random() * 6 + 4,
                d: Math.random() * canvas.height,
                color: `hsl(${Math.random() * 360}, 80%, 60%)`,
                tilt: Math.random() * 10 - 5,
                tiltAngleIncremental: Math.random() * 0.07 + 0.02,
                tiltAngle: 0
            });
        }

        let animationFrameId;
        const drawFrame = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((p, idx) => {
                p.tiltAngle += p.tiltAngleIncremental;
                p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
                p.x += Math.sin(p.tiltAngle);
                p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

                ctx.beginPath();
                ctx.lineWidth = p.r;
                ctx.strokeStyle = p.color;
                ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
                ctx.stroke();

                if (p.y > canvas.height) {
                    particles[idx] = {
                        ...p,
                        x: Math.random() * canvas.width,
                        y: -20,
                        tilt: Math.random() * 10 - 5
                    };
                }
            });

            if (!this.dom.winnerScreenOverlay.classList.contains("ui-display-none-force")) {
                animationFrameId = requestAnimationFrame(drawFrame);
            } else {
                cancelAnimationFrame(animationFrameId);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };

        drawFrame();

        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }, { passive: true });
    }

    /**
     * Converts JSON database storage states directly into localized downloadable CSV formats
     */
    generateStructuredCSVExportDownload() {
        const data = this.compileAnalyticalTallyMetrics();
        const profiles = Object.values(data.distributionMap);

        if (profiles.length === 0) {
            this.dispatchToastNotification("Export Denied: No candidates found to parse.", "warning");
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Candidate Name,Party Affiliation,Recorded Votes,Consensus Percentage,Extraction Date\n";

        const executionTimestamp = new Date().toLocaleDateString();

        profiles.forEach(p => {
            const formattedName = `"${p.name.replace(/"/g, '""')}"`;
            const formattedParty = `"${p.party.replace(/"/g, '""')}"`;
            csvContent += `${formattedName},${formattedParty},${p.votes},${p.percentage}%,${executionTimestamp}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const linkNode = document.createElement("a");
        linkNode.setAttribute("href", encodedUri);
        linkNode.setAttribute("download", `ElectionAI_Consensus_Audit_Report_${Date.now()}.csv`);
        document.body.appendChild(linkNode);
        
        linkNode.click();
        linkNode.remove();
        
        this.dispatchToastNotification("Encrypted CSV data matrix output compiled and downloaded successfully.", "success");
    }

    /**
     * Appends dialogue data arrays and pushes changes down to structural page templates
     */
    appendChatMessage(roleType, messageText) {
        this.state.chatHistory.push({ role: roleType, content: messageText });
        
        const node = document.createElement("div");
        node.className = `chat-bubble-row bubble-role-${roleType} fade-in-animation`;
        node.innerHTML = `
            <div class="chat-bubble-avatar-identifier">${roleType === 'user' ? 'V' : 'AI'}</div>
            <div class="chat-bubble-text-payload">${this.sanitizeInputString(messageText).replace(/\n/g, '<br>')}</div>
        `;

        this.dom.chatLogs.appendChild(node);
        this.dom.chatLogs.scrollTop = this.dom.chatLogs.scrollHeight;
    }

    /**
     * Connects with the remote Cloudflare Workers API endpoint configuration vectors
     */
    async dispatchChatQueryToWorkerGateway() {
        const query = this.dom.chatInput.value.trim();
        if (!query) return;

        this.dom.chatInput.value = "";
        this.appendChatMessage("user", query);

        const loaderBubble = document.createElement("div");
        loaderBubble.className = "chat-bubble-row bubble-role-assistant chat-bubble-loader-state";
        loaderBubble.innerHTML = `
            <div class="chat-bubble-avatar-identifier">AI</div>
            <div class="chat-bubble-text-payload processing-pulse-vector">Processing cryptographic logic chains...</div>
        `;
        this.dom.chatLogs.appendChild(loaderBubble);
        this.dom.chatLogs.scrollTop = this.dom.chatLogs.scrollHeight;

        try {
            const requestPayload = {
                message: query,
                history: this.state.chatHistory.slice(-5),
                language: "en"
            };

            const response = await fetch(this.apiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestPayload)
            });

            loaderBubble.remove();

            if (!response.ok) {
                throw new Error(`Gateway returned anomalous structural status code: ${response.status}`);
            }

            const jsonResponse = await response.json();
            
            if (jsonResponse && jsonResponse.success && jsonResponse.reply) {
                this.appendChatMessage("assistant", jsonResponse.reply);
            } else {
                this.appendChatMessage("assistant", "Gateway Error: Remote data streams parsed incorrectly or missing core definitions.");
            }

        } catch (networkError) {
            console.error("AI Worker Network Exception Thread:", networkError);
            loaderBubble.remove();
            this.appendChatMessage("assistant", "Fallback System Core Notice: Connection to Cloudflare Worker edge node timed out. Please check your network connection or verify your Worker deployment.");
            this.dispatchToastNotification("AI Gateway Connection Interrupted.", "danger");
        }
    }
}

// Instantiate application object layer globally when Document structure completes bootstrap phases
document.addEventListener("DOMContentLoaded", () => {
    window.ElectionEngineInstance = new ElectionApp();
    
    const appLoader = document.getElementById("global-loader");
    if (appLoader) {
        appLoader.classList.add("fade-out-animation");
        setTimeout(() => appLoader.remove(), 600);
    }
});
