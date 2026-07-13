<!DOCTYPE html>
<html lang="en" data-ui-scale="medium">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - ElectionAI</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Global App Loader -->
    <div id="global-loader" class="flex-center-alignment">
        <div class="spinner-ring"></div>
        <p class="processing-pulse-vector" style="font-weight: 600; margin-top: 8px;">Loading Dashboard Panels...</p>
    </div>

    <!-- Live Toast Alert Anchor System -->
    <div id="toast-boundary-anchor"></div>

    <main class="app-mainframe-container slide-in-animation">
        
        <!-- Platform Header Hub -->
        <header class="platform-header-hub">
            <div class="brand-vector-group">
                <h1><span>ElectionAI</span> Admin Dashboard</h1>
                <p>Manage election rules, add candidates, and track live results.</p>
            </div>
            <div class="flex-align-center" style="gap: 12px;">
                <button type="button" class="btn-action-control" onclick="toggleInterfaceTheme()" style="background: var(--bg-card-substrate); border: 1px solid var(--border-neon-heavy); width: auto;">
                    🌓 Change Theme
                </button>
                <button type="button" class="btn-action-control" onclick="window.open('vote.html', '_blank')" style="background: var(--accent-primary-vector); width: auto; font-weight: 700;">
                    🌐 Open Public Voting Page
                </button>
            </div>
        </header>

        <!-- Dynamic Live Stats Matrix Layout -->
        <div class="dashboard-analytics-matrix">
            <div class="metric-card-node">
                <div class="metric-label">System Status</div>
                <div class="metric-value" id="stat-system-status" style="font-size: 1.3rem; color: var(--accent-warning-glow);">STANDBY</div>
            </div>
            <div class="metric-card-node">
                <div class="metric-label">Total Votes Cast</div>
                <div class="metric-value" id="stat-total-votes">0</div>
            </div>
            <div class="metric-card-node">
                <div class="metric-label">Registered Candidates</div>
                <div class="metric-value" id="stat-total-candidates">0</div>
            </div>
            <div class="metric-card-node">
                <div class="metric-label">Current Leader</div>
                <div class="metric-value" id="stat-current-leader" style="font-size: 1.4rem; color: var(--accent-success-glow);">N/A</div>
            </div>
        </div>

        <!-- Split Column Layout Bifurcation Matrix -->
        <div class="layout-bifurcation-grid">
            
            <!-- Left Side Inputs and Directories -->
            <div class="layout-column">
                
                <!-- Setup Form Panel -->
                <section class="glassmorphism-surface">
                    <div class="panel-section-header">1. General Election Setup</div>
                    <form id="form-election-setup" onsubmit="saveGeneralSettings(event)">
                        <div class="form-structural-grid">
                            <div class="input-group-element">
                                <label>Election Name</label>
                                <input type="text" id="setup-election-name" class="input-field-vector" placeholder="e.g., Student Council 2026" required>
                            </div>
                            <div class="input-group-element">
                                <label>Election Date</label>
                                <input type="date" id="setup-election-date" class="input-field-vector" required>
                            </div>
                        </div>
                        <div class="form-structural-grid" style="margin-top: 12px;">
                            <div class="input-group-element">
                                <label>Polls Open Time</label>
                                <input type="time" id="setup-start-time" class="input-field-vector" required>
                            </div>
                            <div class="input-group-element">
                                <label>Polls Close Time</label>
                                <input type="time" id="setup-end-time" class="input-field-vector" required>
                            </div>
                        </div>
                        <div class="input-group-element" style="margin-top: 12px; margin-bottom: 20px;">
                            <label>Election Description for Voters</label>
                            <input type="text" id="setup-election-desc" class="input-field-vector" placeholder="Provide instructions or background info for voters...">
                        </div>
                        <button type="submit" class="btn-action-control">Save Election Settings</button>
                    </form>
                </section>

                <!-- Candidate Enrollment Form Panel -->
                <section class="glassmorphism-surface">
                    <div class="panel-section-header">2. Register Candidates</div>
                    <form id="form-candidate-registration" onsubmit="registerNewCandidate(event)">
                        <div class="form-structural-grid">
                            <div class="input-group-element">
                                <label>Candidate Full Name</label>
                                <input type="text" id="cand-name" class="input-field-vector" placeholder="Jane Doe" required>
                            </div>
                            <div class="input-group-element">
                                <label>Party or Affiliation</label>
                                <input type="text" id="cand-party" class="input-field-vector" placeholder="Independent / Party Name" required>
                            </div>
                        </div>
                        <div class="form-structural-grid" style="margin-top: 12px; margin-bottom: 20px;">
                            <div class="input-group-element">
                                <label>Candidate Photo Link (URL)</label>
                                <input type="url" id="cand-photo" class="input-field-vector" placeholder="https://example.com/photo.jpg">
                            </div>
                            <div class="input-group-element">
                                <label>Party Logo / Symbol Link (URL)</label>
                                <input type="url" id="cand-symbol" class="input-field-vector" placeholder="https://example.com/logo.png">
                            </div>
                        </div>
                        <button type="submit" class="btn-action-control action-success">Add Candidate to Ballot</button>
                    </form>
                </section>

                <!-- Candidate List and Live Ledger Display Panel -->
                <section class="glassmorphism-surface">
                    <div class="panel-section-header">3. Candidate Directory & Live Counts</div>
                    <div class="table-scrolling-container">
                        <table class="ledger-data-matrix">
                            <thead>
                                <tr>
                                    <th>Candidate Info</th>
                                    <th>Party</th>
                                    <th>Total Votes Received</th>
                                    <th style="text-align: right;">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="admin-candidate-rows">
                                <tr>
                                    <td colspan="4" class="empty-state-vector-notice ui-text-center">
                                        No registered candidates exist within this system. Use the form above to add profiles.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            <!-- Right Side Visualizations and System Commands -->
            <div class="layout-column">
                
                <!-- Dynamic Pure CSS Bar Graph Interface Panel -->
                <section class="glassmorphism-surface">
                    <div class="panel-section-header">Live Vote Share Visualizer</div>
                    <div class="chart-rendering-canvas-boundary flex-center-alignment" id="chart-fallback-box" style="flex-direction: column; background: rgba(10,15,26,0.3); border-radius: 8px; border: 1px dashed var(--border-neon-grid); height: auto; min-height: 220px;">
                        <p class="ui-opacity-dim" id="chart-hint-text" style="font-size: 0.9rem; font-style: italic; padding: 20px; text-align: center;">Add candidates and open polls to track real-time bars...</p>
                        <div id="dynamic-bar-chart-pool" style="width: 100%; padding: 16px; display: flex; flex-direction: column; gap: 12px;"></div>
                    </div>
                </section>

                <!-- Master Operations Execution Node Panel -->
                <section class="glassmorphism-surface">
                    <div class="panel-section-header">System Operations Node</div>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button type="button" class="btn-action-control action-warning" onclick="forceCloseVotingWindow()">
                            🔒 Force Close Polls Right Now
                        </button>
                        <button type="button" class="btn-action-control" onclick="downloadAuditReportCSV()" style="background: #4b5563;">
                            📥 Download Results Spreadsheet (CSV)
                        </button>
                        <button type="button" class="btn-action-control action-purge" onclick="purgeEntireSystemDatabase()">
                            ⚠️ Completely Wipe All Election Data
                        </button>
                    </div>
                </section>
            </div>

        </div>
    </main>

    <!-- --- JAVASCRIPT ADMIN DASHBOARD APPLICATION LOGIC MATRIX --- -->
    <script>
        const STORAGE_PREFIX = "electionai_";

        // DOM Elements Cache
        const domLoader = document.getElementById("global-loader");
        const tableBody = document.getElementById("admin-candidate-rows");
        const chartPool = document.getElementById("dynamic-bar-chart-pool");
        const chartHint = document.getElementById("chart-hint-text");

        // Storage Wrapper Functions
        function setLocal(key, value) { localStorage.setItem(STORAGE_PREFIX + key, value); }
        function getLocal(key, fallback = "") { return localStorage.getItem(STORAGE_PREFIX + key) || fallback; }

        // Native Notification Dispatch Engine
        function showToast(msg, type = "success") {
            const anchor = document.getElementById("toast-boundary-anchor");
            if (!anchor) return;
            const node = document.createElement("div");
            node.className = `toast-node toast-type-${type} slide-in-animation`;
            node.innerText = msg;
            anchor.appendChild(node);
            setTimeout(() => {
                node.classList.add("fade-out-animation");
                setTimeout(() => node.remove(), 400);
            }, 4000);
        }

        // Interlocking Theme Mode Matrix Functions
        window.toggleInterfaceTheme = function() {
            const current = getLocal("theme_mode", "dark");
            const target = current === "dark" ? "light" : "dark";
            setLocal("theme_mode", target);
            syncInterfaceThemeState();
        };

        function syncInterfaceThemeState() {
            if (getLocal("theme_mode", "dark") === "light") {
                document.documentElement.classList.add("light-mode-substrate");
            } else {
                document.documentElement.classList.remove("light-mode-substrate");
            }
        }

        // Configuration Module: Save General Configuration Rules
        window.saveGeneralSettings = function(e) {
            e.preventDefault();
            const name = document.getElementById("setup-election-name").value.trim();
            const dateStr = document.getElementById("setup-election-date").value;
            const openStr = document.getElementById("setup-start-time").value;
            const closeStr = document.getElementById("setup-end-time").value;
            const desc = document.getElementById("setup-election-desc").value.trim();

            const startTimestamp = new Date(`${dateStr}T${openStr}`).getTime();
            const endTimestamp = new Date(`${dateStr}T${closeStr}`).getTime();

            if (endTimestamp <= startTimestamp) {
                showToast("The Polls Close Time must be after the Polls Open Time.", "danger");
                return;
            }

            setLocal("election_name", name);
            setLocal("election_date", dateStr);
            setLocal("start_time", String(startTimestamp));
            setLocal("end_time", String(endTimestamp));
            setLocal("election_description", desc);

            showToast("General Election settings saved and synced successfully.");
            refreshDashboardViews();
        };

        // Configuration Module: Register Candidate Profile Parameters
        window.registerNewCandidate = function(e) {
            e.preventDefault();
            const name = document.getElementById("cand-name").value.trim();
            const party = document.getElementById("cand-party").value.trim();
            const photo = document.getElementById("cand-photo").value.trim();
            const symbol = document.getElementById("cand-symbol").value.trim();

            let candidates = JSON.parse(getLocal("candidates", "[]"));
            
            const newCand = {
                id: "id_" + Date.now(),
                name: name,
                party: party,
                photo: photo,
                symbol: symbol,
                votes: 0
            };

            candidates.push(newCand);
            setLocal("candidates", JSON.stringify(candidates));
            
            document.getElementById("form-candidate-registration").reset();
            showToast(`Added ${name} directly to active ballot matrix registry!`);
            refreshDashboardViews();
        };

        // Configuration Module: Purge Specific Candidate Vector Profile
        window.removeCandidateProfile = function(id) {
            let candidates = JSON.parse(getLocal("candidates", "[]"));
            const targetIndex = candidates.findIndex(c => c.id === id);
            
            if(targetIndex !== -1) {
                const name = candidates[targetIndex].name;
                let globalVotes = parseInt(getLocal("total_votes", "0"), 10);
                let lostVotes = parseInt(candidates[targetIndex].votes, 10) || 0;
                
                setLocal("total_votes", String(Math.max(0, globalVotes - lostVotes)));
                candidates.splice(targetIndex, 1);
                setLocal("candidates", JSON.stringify(candidates));
                
                showToast(`Removed candidate "${name}" from running profiles registry.`, "warning");
                refreshDashboardViews();
            }
        };

        // Operations Module: Emergency Shutdown Signal Action
        window.forceCloseVotingWindow = function() {
            setLocal("end_time", String(Date.now()));
            showToast("Polls have been closed early. Public terminals are now locked down.", "warning");
            refreshDashboardViews();
        };

        // Operations Module: Master Structural Database Purge
        window.purgeEntireSystemDatabase = function() {
            if (confirm("Are you completely sure you want to wipe all configurations, candidates, and live vote data? This action cannot be undone.")) {
                localStorage.clear();
                showToast("System database completely wiped. Reverting state back to setup baseline.", "danger");
                
                setLocal("total_votes", "0");
                setLocal("candidates", "[]");
                
                document.getElementById("form-election-setup").reset();
                document.getElementById("form-candidate-registration").reset();
                
                refreshDashboardViews();
            }
        };

        // Core Rendering & Aggregation Engine Loops
        function refreshDashboardViews() {
            syncInterfaceThemeState();

            // 1. Compute Active Window Status Operational Bounds
            const start = parseInt(getLocal("start_time", "0"), 10);
            const end = parseInt(getLocal("end_time", "0"), 10);
            const now = Date.now();
            const domStatus = document.getElementById("stat-system-status");

            if(!start || !end) {
                domStatus.innerText = "STANDBY";
                domStatus.className = "metric-value status-standby";
            } else if (now < start) {
                domStatus.innerText = "UPCOMING";
                domStatus.className = "metric-value status-standby";
            } else if (now >= start && now <= end) {
                domStatus.innerText = "LIVE OPEN";
                domStatus.className = "metric-value status-live-active";
            } else {
                domStatus.innerText = "ENDED";
                domStatus.className = "metric-value status-archived";
            }

            // 2. Map Counters Metadata States
            const candidates = JSON.parse(getLocal("candidates", "[]"));
            const totalVotesCount = parseInt(getLocal("total_votes", "0"), 10);

            document.getElementById("stat-total-votes").innerText = totalVotesCount;
            document.getElementById("stat-total-candidates").innerText = candidates.length;

            // 3. Render Datagrid Interface & Core Leader Metrics Variables Tracking
            let leaderName = "N/A";
            let maxVotes = -1;
            let checkTie = false;

            if (candidates.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="empty-state-vector-notice ui-text-center">
                            No registered candidates exist within this system. Use the form above to add profiles.
                        </td>
                    </tr>`;
                chartPool.innerHTML = "";
                chartHint.classList.remove("ui-display-none-force");
            } else {
                tableBody.innerHTML = "";
                chartPool.innerHTML = "";
                chartHint.classList.add("ui-display-none-force");

                candidates.forEach(c => {
                    const votesInt = parseInt(c.votes, 10) || 0;
                    
                    if (votesInt > maxVotes) {
                        maxVotes = votesInt;
                        leaderName = c.name;
                        checkTie = false;
                    } else if (votesInt === maxVotes && maxVotes > 0) {
                        checkTie = true;
                    }

                    const tr = document.createElement("tr");
                    const pUrl = c.photo || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><rect width='100%' height='100%' fill='%231f2937'/></svg>";
                    
                    tr.innerHTML = `
                        <td class="flex-align-center">
                            <img src="${pUrl}" class="ledger-thumb-pic" alt="">
                            <span style="font-weight: 600;">${c.name}</span>
                        </td>
                        <td><span class="ui-opacity-dim">${c.party}</span></td>
                        <td><span class="badge-count-vector">${votesInt} votes</span></td>
                        <td style="text-align: right;">
                            <button type="button" class="btn-action-control action-purge" onclick="removeCandidateProfile('${c.id}')" style="width:auto; padding:4px 10px; font-size:0.8rem;">
                                Delete
                            </button>
                        </td>
                    `;
                    tableBody.appendChild(tr);

                    // 4. Generate Hardware-Accelerated Dynamic CSS Live Bars
                    const pctShare = totalVotesCount > 0 ? Math.round((votesInt / totalVotesCount) * 100) : 0;
                    const chartRow = document.createElement("div");
                    chartRow.style.width = "100%";
                    chartRow.innerHTML = `
                        <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:4px;">
                            <span>${c.name} (${c.party})</span>
                            <strong>${pctShare}% (${votesInt})</strong>
                        </div>
                        <div style="background:rgba(255,255,255,0.05); height:8px; border-radius:4px; overflow:hidden; border:1px solid var(--border-neon-grid);">
                            <div style="background:var(--accent-primary-vector); width:${pctShare}%; height:100%; transition:width 0.4s ease;"></div>
                        </div>
                    `;
                    chartPool.appendChild(chartRow);
                });
            }

            document.getElementById("stat-current-leader").innerText = (checkTie && maxVotes > 0) ? "Tie Race" : leaderName;

            // Load values to text inputs if fields match structural persistence patterns cleanly
            if (getLocal("election_name") && document.activeElement.tagName !== "INPUT") {
                document.getElementById("setup-election-name").value = getLocal("election_name");
                document.getElementById("setup-election-date").value = getLocal("election_date");
                document.getElementById("setup-start-time").value = getLocal("start_time_str") || "";
                document.getElementById("setup-end-time").value = getLocal("end_time_str") || "";
                document.getElementById("setup-election-desc").value = getLocal("election_description");
            }
        }

        // Data Management Module: Generate and Compile Audit spreadsheet logs (CSV)
        window.downloadAuditReportCSV = function() {
            const candidates = JSON.parse(getLocal("candidates", "[]"));
            if(candidates.length === 0) {
                showToast("There are no candidate data records available to compile into a CSV document.", "warning");
                return;
            }

            let csvContent = "data:text/csv;charset=utf-8,Candidate Name,Party Affiliation,Votes Logged Tally\n";
            candidates.forEach(c => {
                csvContent += `"${c.name}","${c.party}",${c.votes}\n`;
            });

            const encodedUri = encodeURI(csvContent);
            const hiddenDownloadAnchor = document.createElement("a");
            hiddenDownloadAnchor.setAttribute("href", encodedUri);
            hiddenDownloadAnchor.setAttribute("download", `ElectionAI_Results_${Date.now()}.csv`);
            document.body.appendChild(hiddenDownloadAnchor);
            hiddenDownloadAnchor.click();
            document.body.removeChild(hiddenDownloadAnchor);
            showToast("CSV data spreadsheet downloaded successfully.");
        };

        // Cache simple input changes instantly to maintain field states across reloads cleanly
        document.getElementById("form-election-setup").addEventListener("input", function() {
            setLocal("start_time_str", document.getElementById("setup-start-time").value);
            setLocal("end_time_str", document.getElementById("setup-end-time").value);
        });

        // App Bootstrap Hook Routine Implementation Entrypoint
        function bootstrapAdminMainframe() {
            if(!localStorage.getItem(STORAGE_PREFIX + "total_votes")) setLocal("total_votes", "0");
            if(!localStorage.getItem(STORAGE_PREFIX + "candidates")) setLocal("candidates", "[]");

            refreshDashboardViews();

            if (domLoader) {
                domLoader.classList.add("fade-out-animation");
                setTimeout(() => domLoader.remove(), 400);
            }

            // Sync with updates from public terminal interface interactions instantly
            window.addEventListener("storage", function(e) {
                if(e.key && e.key.startsWith(STORAGE_PREFIX)) {
                    refreshDashboardViews();
                }
            });

            // Keep timeline logic states and calculations precise every second
            setInterval(refreshDashboardViews, 1000);
        }

        document.addEventListener("DOMContentLoaded", bootstrapAdminMainframe);
    </script>
</body>
</html>
