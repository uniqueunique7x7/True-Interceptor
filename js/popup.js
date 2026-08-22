(()=>{var m=class{constructor(){try{this.state={isEnabled:!1,rules:[],loading:!0,version:null,versionError:null,stats:{modifiedRequests:0,urlModifications:0,postModifications:0,responseModifications:0,blockedRequests:0,headerModifications:0},activityLog:[],showAddRule:!1,editingRule:null,defaultRulesEnabled:!0,showDefaultRulesPanel:!1,showCustomRulesPanel:!1,categories:[],activeCategory:"all"},this.newRule=this.getDefaultNewRule(),this._newRuleSnapshot=JSON.stringify(this.newRule),this.init()}catch(e){console.error("Error initializing RequestModifierPopup:",e)}}async init(){this.setupEventListeners(),this.render(),await this.refreshData(),this.startAutoRefresh()}cleanup(){this.stopAutoRefresh()}setupEventListeners(){document.addEventListener("click",e=>{let t=e.target;if((t.matches(".toggle-switch")||t.closest(".toggle-switch"))&&!t.matches(".default-rules-toggle")&&!t.closest(".default-rules-toggle")){e.preventDefault(),e.stopPropagation(),this.toggleEnabled();return}if(t.matches(".default-rules-toggle")||t.closest(".default-rules-toggle")){e.preventDefault(),e.stopPropagation(),this.toggleDefaultRules();return}if(t.matches(".rule-toggle-small")||t.closest(".rule-toggle-small")){e.preventDefault(),e.stopPropagation();let s=t.getAttribute("data-rule-id")||t.closest(".rule-toggle-small").getAttribute("data-rule-id");this.toggleRule(s);return}if(t.matches(".activity-url")){t.classList.toggle("expanded");return}if(t.matches(".btn-edit-rule")){this.editRule(t.getAttribute("data-rule-id"));return}if(t.matches(".btn-move-up")){this.moveRule(t.getAttribute("data-rule-id"),-1);return}if(t.matches(".btn-move-down")){this.moveRule(t.getAttribute("data-rule-id"),1);return}if(t.matches(".btn-delete-rule")){this.deleteRule(t.getAttribute("data-rule-id"));return}if(t.matches(".btn-add-rule")){this.showAddRuleModal();return}if(t.matches(".btn-cancel")){this.hideModal();return}if(t.matches(".btn-clear-stats")){this.clearStats();return}if(t.matches(".btn-clear-activity")){this.clearActivityLog();return}if(t.matches(".btn-export-rules")){this.exportCustomRules();return}if(t.matches(".btn-import-rules")){document.getElementById("import-file-input").click();return}if(t.matches(".btn-view-defaults")){this.showDefaultRulesPanel();return}if(t.matches(".btn-view-customs")){this.showCustomRulesPanel();return}if(t.matches(".btn-close-panel")){this.closePanels(t.getAttribute("data-panel"));return}if(t.matches(".category-tab")){this.state.activeCategory=t.getAttribute("data-category"),this.updateRulesDisplay();return}if(t.matches(".btn-add-pair")){e.preventDefault(),this.addFindReplacePair();return}if(t.matches(".btn-remove-pair")){e.preventDefault(),this.removeFindReplacePair(parseInt(t.getAttribute("data-pair-idx"),10));return}if(t.matches(".btn-add-json-field")){e.preventDefault(),this.addJsonField();return}if(t.matches(".btn-remove-json-field")){e.preventDefault(),this.removeJsonField(parseInt(t.getAttribute("data-field-idx"),10));return}if(t.matches(".btn-add-header-rule")){e.preventDefault(),this.addHeaderRule();return}if(t.matches(".btn-remove-header-rule")){e.preventDefault(),this.removeHeaderRule(parseInt(t.getAttribute("data-header-idx"),10));return}if(t.matches(".rules-panel-overlay")){let s=t.getAttribute("data-panel");s&&this.closePanels(s);return}}),document.addEventListener("keydown",e=>{e.key==="Escape"&&this.state.showAddRule&&this.hideModal()}),document.addEventListener("submit",e=>{e.target.matches(".rule-form")&&(e.preventDefault(),this.saveRule())}),document.addEventListener("input",e=>{e.target.matches(".form-input, .form-select")?this.updateFormField(e.target.name,e.target.value):e.target.matches(".form-checkbox input")&&this.updateFormField(e.target.name,e.target.checked)}),document.addEventListener("change",e=>{e.target.matches("#import-file-input")?this.importCustomRules(e.target):e.target.matches('.find-replace-pair input[type="checkbox"]')?this.updateFormField(e.target.name,e.target.checked):e.target.matches("select.form-input")&&(this.updateFormField(e.target.name,e.target.value),e.target.name.startsWith("jsonField-")&&e.target.name.endsWith("-action")?this.updateJsonFieldsList():e.target.name.startsWith("headerRule-")&&e.target.name.endsWith("-action")&&this.updateHeaderRulesList())})}async refreshData(e=0){try{let a=await this.sendMessage({action:"getStatus"});if(a){if(this.state.isEnabled=a.isEnabled,this.state.rules=a.rules||[],this.state.stats=a.stats||this.state.stats,this.state.activityLog=a.activityLog||[],this.state.defaultRulesEnabled=a.hasDefaultRules||!1,this.state.categories=a.categories||[],this.state.version=a.version||null,this.state.versionError=a.versionError||null,this.state.rules.length===0&&this.state.defaultRulesEnabled&&e<10){setTimeout(()=>this.refreshData(e+1),600);return}this.state.loading=!1,this.render()}else e<10?setTimeout(()=>this.refreshData(e+1),600):(this.state.loading=!1,this.render(),this.showErrorMessage("Failed to connect to extension background script"))}catch{if(e<3){setTimeout(()=>this.refreshData(e+1),600);return}this.state.loading=!1,this.showErrorMessage("Failed to connect to extension background script")}}startAutoRefresh(){this.autoRefreshInterval=setInterval(()=>{this.refreshDataAndUpdateDisplay()},5e3)}stopAutoRefresh(){this.autoRefreshInterval&&(clearInterval(this.autoRefreshInterval),this.autoRefreshInterval=null)}async sendMessage(e){return new Promise(t=>{try{chrome.runtime.sendMessage(e,s=>{chrome.runtime.lastError?(console.error("Chrome runtime error:",chrome.runtime.lastError),t(null)):t(s)})}catch(s){console.error("Error sending message:",s),t(null)}})}async toggleEnabled(){try{let e=await this.sendMessage({action:"toggleEnabled"});if(e&&e.isEnabled!==void 0){this.state.isEnabled=e.isEnabled,this.updateStatusDisplay();let t=document.querySelector(".header-controls .toggle-switch:not(.default-rules-toggle)");t&&(this.state.isEnabled?t.classList.add("active"):t.classList.remove("active"),this.showSuccessAnimation(t))}else this.showErrorMessage("Failed to toggle extension. Please try again.")}catch(e){console.error("Error toggling extension:",e),this.showErrorMessage("An error occurred while toggling the extension. Please try again.")}}updateRulesDisplay(){try{let e=this.state.rules.filter(i=>i.isDefault),t=this.state.rules.filter(i=>!i.isDefault),s=document.querySelector(".panel-card.default-panel .panel-count");s&&(s.textContent=e.filter(i=>i.enabled!==!1).length);let a=document.querySelector(".panel-card.custom-panel .panel-count");if(a&&(a.textContent=t.filter(i=>i.enabled!==!1).length),this.state.showDefaultRulesPanel){let i=this.state.activeCategory||"all",n=i==="all"?e:e.filter(d=>d.category===i);document.querySelectorAll('.rules-panel-overlay[data-panel="default"] .category-tab').forEach(d=>d.classList.toggle("active",d.getAttribute("data-category")===i));let o=document.querySelector('.rules-panel-overlay[data-panel="default"] .rules-list-panel');o&&(n.length>0?o.innerHTML=n.map(d=>this.getCompactRuleItem(d)).join(""):o.innerHTML='<div class="empty-state-compact"><span class="empty-text">No rules in this category</span></div>')}this.state.showCustomRulesPanel&&this.renderCustomPanel()}catch(e){console.error("Error updating rules display:",e)}}renderCustomPanel(){let e=this.state.rules.filter(s=>!s.isDefault),t=document.querySelector('.rules-panel-overlay[data-panel="custom"] .panel-content');t&&(e.length>0?t.innerHTML=`
				<div class="rules-list-panel">
					${e.map(s=>this.getRuleItem(s)).join("")}
				</div>
			`:t.innerHTML=`
				<div class="empty-state">
					<div class="empty-state-icon">\u{1F4DD}</div>
					<div class="empty-state-text">No custom rules configured</div>
					<button class="btn btn-primary btn-add-rule">Create your first rule</button>
				</div>
			`)}updateStatusDisplay(){try{let e=document.querySelector(".status-indicator");if(e){let s=e.querySelector(".status-dot"),a=e.querySelector(".status-text");s&&(this.state.isEnabled?s.classList.add("active"):s.classList.remove("active")),a&&(a.textContent=this.state.isEnabled?"Active":"Inactive")}let t=document.querySelectorAll(".stat-value");t.length>=6&&(t[0].textContent=this.state.stats.modifiedRequests||0,t[1].textContent=this.state.stats.urlModifications||0,t[2].textContent=this.state.stats.postModifications||0,t[3].textContent=this.state.stats.responseModifications||0,t[4].textContent=this.state.stats.blockedRequests||0,t[5].textContent=this.state.stats.headerModifications||0)}catch(e){console.error("Error updating status display:",e)}}updateActivityDisplay(){try{let e=document.querySelector(".activity-log-list");if(!e)return;let t=this.state.activityLog||[];t.length>0?e.innerHTML=t.map(a=>this.getActivityEntry(a)).join(""):e.innerHTML=this.getActivityEmptyState();let s=document.querySelector(".activity-count");s&&(s.textContent=t.length+" entries")}catch(e){console.error("Error updating activity display:",e)}}async refreshDataAndUpdateDisplay(){try{let e=await this.sendMessage({action:"getStatus"});if(e){let t=JSON.stringify(this.state.stats)!==JSON.stringify(e.stats),s=JSON.stringify(this.state.rules)!==JSON.stringify(e.rules),a=e.activityLog||[],i=this.state.activityLog.length!==a.length||this.state.activityLog.length>0&&JSON.stringify(this.state.activityLog)!==JSON.stringify(a),n=this.state.isEnabled!==e.isEnabled,r=this.state.defaultRulesEnabled!==e.hasDefaultRules;this.state.isEnabled=e.isEnabled,this.state.rules=e.rules||[],this.state.stats=e.stats||this.state.stats,this.state.activityLog=a,this.state.defaultRulesEnabled=e.hasDefaultRules||!1,this.state.categories=e.categories||[],this.state.version=e.version||null,(t||s||i||n||r)&&(this.updateStatusDisplay(),this.updateRulesDisplay(),i&&this.updateActivityDisplay())}}catch{}}getDefaultNewRule(){return{title:"",findReplacePairs:[{find:"",replace:"",useRegex:!1}],targetType:"all",description:"",urlMatch:"",category:"",jsonFields:[],headerRules:[]}}showAddRuleModal(){if(this.state.showAddRule=!0,this.state.editingRule=null,this.newRule=this.getDefaultNewRule(),this._newRuleSnapshot=JSON.stringify(this.newRule),!document.querySelector(".modal-overlay")){let t=this.getModal();document.body.insertAdjacentHTML("beforeend",t),requestAnimationFrame(()=>{let s=document.querySelector(".modal-overlay");s&&s.classList.add("show")})}}editRule(e){let t=this.state.rules.find(a=>a.id===e);if(!t||t._protected)return;this.state.showAddRule=!0,this.state.editingRule=e;let s=[];Array.isArray(t.findReplacePairs)&&t.findReplacePairs.length>0?s=t.findReplacePairs.map(a=>({...a})):s=[{find:"",replace:"",useRegex:!1}],this.newRule={id:t.id,title:t.title||"",findReplacePairs:s,targetType:t.targetType||"url",description:t.description||"",urlMatch:t.urlMatch||"",enabled:t.enabled!==!1,category:t.category||"",jsonFields:Array.isArray(t.jsonFields)?t.jsonFields.map(a=>({...a})):[],headerRules:Array.isArray(t.headerRules)?t.headerRules.map(a=>({...a})):[]},this._newRuleSnapshot=JSON.stringify(this.newRule),this.refreshModal()}async saveRule(){try{let t=this.newRule.targetType||"url",s=t!=="block"&&t!=="headers"&&t!=="jsonBody";if(s){if(!this.newRule.findReplacePairs||this.newRule.findReplacePairs.length===0){this.showErrorMessage("At least one Find/Replace pair is required.");return}let l=this.newRule.findReplacePairs[0];if(!l||!l.find||!l.find.trim()){this.showErrorMessage("At least one Find/Replace pair is required.");return}for(let c=0;c<this.newRule.findReplacePairs.length;c++){let u=this.newRule.findReplacePairs[c];if(!u.find||!u.find.trim()){this.showErrorMessage(`Find text is required for pair ${c+1}.`);return}}}if(t==="block"&&(!this.newRule.urlMatch||!this.newRule.urlMatch.trim())){this.showErrorMessage("URL match pattern is required for block rules.");return}let a=this.newRule.jsonFields&&this.newRule.jsonFields.length>0,i=this.newRule.findReplacePairs&&this.newRule.findReplacePairs.some(l=>l.find&&l.find.trim());if(t==="headers"&&(!this.newRule.headerRules||this.newRule.headerRules.length===0)){this.showErrorMessage("At least one header modification is required for header rules.");return}if(t==="jsonBody"&&!a&&!i){this.showErrorMessage("At least one JSON field modification is required for JSON body rules.");return}if(!this.newRule.title||!this.newRule.title.trim())if(s&&this.newRule.findReplacePairs&&this.newRule.findReplacePairs.length>0){var e=this.newRule.findReplacePairs[0];this.newRule.title=`Rule for "${e.find.substring(0,20)}${e.find.length>20?"...":""}"`}else this.newRule.title=t==="block"?"Block Rule":"Untitled Rule";let n=this.normalizeUrlPatterns(this.newRule.urlMatch||""),r={title:this.newRule.title.trim(),targetType:t,description:(this.newRule.description||"").trim(),urlMatch:n,enabled:this.newRule.enabled!==!1,category:(this.newRule.category||"").trim()};s&&this.newRule.findReplacePairs&&this.newRule.findReplacePairs.length>0&&(r.findReplacePairs=this.newRule.findReplacePairs.filter(l=>l&&l.find&&l.find.trim()).map(l=>({find:l.find.trim(),replace:l.replace||"",useRegex:!!l.useRegex})));let o=(this.newRule.jsonFields||[]).filter(l=>l&&l.path&&l.path.trim()).map(l=>({action:l.action||"set",path:l.path.trim(),value:l.value||"",newName:l.newName||""}));o.length>0&&(r.jsonFields=o);let d=(this.newRule.headerRules||[]).filter(l=>l&&l.header&&l.header.trim()).map(l=>({action:l.action||"set",header:l.header.trim(),value:l.value||"",newName:l.newName||""}));if(d.length>0&&(r.headerRules=d),this.state.editingRule){r.id=this.newRule.id;let l=await this.sendMessage({action:"updateRule",ruleId:r.id,updates:r});if(l&&l.success){let c=this.state.rules.findIndex(u=>u.id===r.id);c!==-1&&(this.state.rules[c]={...this.state.rules[c],...r},delete this.state.rules[c].searchText,delete this.state.rules[c].replaceText,delete this.state.rules[c].useRegex)}else{this.showErrorMessage("Failed to update rule. Please try again.");return}}else{let l=await this.sendMessage({action:"addRule",rule:r});if(l&&l.success)this.state.rules.push(l.rule);else{this.showErrorMessage("Failed to add rule. Please try again.");return}}this.newRule=this.getDefaultNewRule(),this._newRuleSnapshot=JSON.stringify(this.newRule),this.hideModal();let p=this.state.rules.filter(l=>!l.isDefault),h=document.querySelector(".panel-card.custom-panel .panel-info p");h&&(h.textContent=`Your rules \u2022 ${p.filter(l=>l.enabled!==!1).length} active`),setTimeout(()=>{this.updateRulesDisplay(),this.state.showCustomRulesPanel&&this.renderCustomPanel()},250)}catch(t){console.error("Error saving rule:",t),this.showErrorMessage("An error occurred while saving the rule. Please try again.")}}async deleteRule(e){try{let t=this.state.rules.find(i=>i.id===e);if(!t){this.showErrorMessage("Rule not found.");return}if(t.isDefault||t._protected){this.showErrorMessage("Protected rules cannot be deleted. You can disable them instead.");return}if(!confirm(`Are you sure you want to delete the rule "${t.title||"Untitled Rule"}"?`))return;let s=t.title||"Untitled Rule",a=await this.sendMessage({action:"deleteRule",ruleId:e});if(a&&a.success){this.state.rules=this.state.rules.filter(n=>n.id!==e);let i=document.querySelector(".panel-card.custom-panel .panel-count");i&&(i.textContent=this.state.rules.filter(n=>!n.isDefault).length),this.updateRulesDisplay(),this.state.showCustomRulesPanel&&this.renderCustomPanel()}else this.showErrorMessage("Failed to delete rule. Please try again.")}catch(t){console.error("Error deleting rule:",t),this.showErrorMessage("An error occurred while deleting the rule. Please try again.")}}async moveRule(e,t){try{let s=await this.sendMessage({action:"moveRule",ruleId:e,direction:t});if(s&&s.success){let a=this.state.rules.findIndex(i=>i.id===e);if(a!==-1){let i=a+t;if(i>=0&&i<this.state.rules.length){let n=this.state.rules[a];this.state.rules[a]=this.state.rules[i],this.state.rules[i]=n}}this.updateRulesDisplay()}else this.showErrorMessage("Failed to move rule. Please try again.")}catch(s){console.error("Error moving rule:",s)}}async clearActivityLog(){try{await this.sendMessage({action:"clearActivityLog"}),this.state.activityLog=[];let e=document.querySelector(".activity-log-list");e&&(e.innerHTML=this.getActivityEmptyState());let t=document.querySelector(".activity-count");t&&(t.textContent="0 entries")}catch(e){console.error("Error clearing activity log:",e)}}async toggleRule(e){try{let t=this.state.rules.find(i=>i.id===e);if(!t){this.showErrorMessage("Rule not found.");return}let s=!t.enabled,a=await this.sendMessage({action:"updateRule",ruleId:e,updates:{enabled:s}});if(a&&a.success){t.enabled=s,this.updateRulesDisplay();let i=document.querySelector(`[data-rule-id="${e}"]`);i&&this.showSuccessAnimation(i)}else this.showErrorMessage("Failed to toggle rule. Please try again.")}catch(t){console.error("Error toggling rule:",t),this.showErrorMessage("An error occurred while toggling the rule. Please try again.")}}showDefaultRulesPanel(){this.state.showDefaultRulesPanel=!0,this.state.showCustomRulesPanel=!1;let e=document.querySelector(".rules-panel-overlay");e&&e.remove();let t=this.state.rules.filter(a=>a.isDefault),s=this.getDefaultRulesPanel(t);document.body.insertAdjacentHTML("beforeend",s),requestAnimationFrame(()=>{let a=document.querySelector(".rules-panel-overlay");a&&a.classList.add("show")})}showCustomRulesPanel(){this.state.showCustomRulesPanel=!0,this.state.showDefaultRulesPanel=!1;let e=document.querySelector(".rules-panel-overlay");e&&e.remove();let t=this.state.rules.filter(a=>!a.isDefault),s=this.getCustomRulesPanel(t);document.body.insertAdjacentHTML("beforeend",s),requestAnimationFrame(()=>{let a=document.querySelector(".rules-panel-overlay");a&&a.classList.add("show")})}closePanels(e){let t=document.querySelector(".rules-panel-overlay");t?(t.classList.add("closing"),setTimeout(()=>{t.classList.remove("show"),t.classList.remove("closing"),e==="default"?this.state.showDefaultRulesPanel=!1:e==="custom"&&(this.state.showCustomRulesPanel=!1),t.remove()},250)):e==="default"?this.state.showDefaultRulesPanel=!1:e==="custom"&&(this.state.showCustomRulesPanel=!1)}hideModal(){if(this._hasUnsavedChanges()&&!confirm("You have unsaved changes. Close anyway?"))return;this.state.showAddRule=!1,this.state.editingRule=null;let e=document.querySelector(".modal-overlay");e&&(e.classList.remove("show"),setTimeout(()=>{e.remove()},250))}_hasUnsavedChanges(){return!this.newRule||!this._newRuleSnapshot?!1:JSON.stringify(this.newRule)!==this._newRuleSnapshot}updateFormField(e,t){if(e.startsWith("pair-")){let s=e.split("-");if(s.length<3)return;let a=s[1],i=s[2],n=parseInt(a,10);if(isNaN(n)||n<0)return;this.newRule.findReplacePairs||(this.newRule.findReplacePairs=[]),this.newRule.findReplacePairs[n]||(this.newRule.findReplacePairs[n]={find:"",replace:"",useRegex:!1}),i==="useRegex"?this.newRule.findReplacePairs[n][i]=t===!0||t==="true":(i==="find"||i==="replace")&&(this.newRule.findReplacePairs[n][i]=t||"");return}if(e.startsWith("jsonField-")){let s=e.split("-");if(s.length<3)return;let a=parseInt(s[1],10),i=s.slice(2).join("-");if(isNaN(a)||a<0)return;this.newRule.jsonFields||(this.newRule.jsonFields=[]),this.newRule.jsonFields[a]||(this.newRule.jsonFields[a]={action:"set",path:"",value:"",newName:""}),this.newRule.jsonFields[a][i]=t||"";return}if(e.startsWith("headerRule-")){let s=e.split("-");if(s.length<3)return;let a=parseInt(s[1],10),i=s.slice(2).join("-");if(isNaN(a)||a<0)return;this.newRule.headerRules||(this.newRule.headerRules=[]),this.newRule.headerRules[a]||(this.newRule.headerRules[a]={action:"set",header:"",value:"",newName:""}),this.newRule.headerRules[a][i]=t||"";return}this.newRule&&this.newRule.hasOwnProperty(e)&&(this.newRule[e]=t)}normalizeUrlPatterns(e){let t=[];return typeof e=="string"?t=e.split(`
`).map(s=>s.trim()).filter(s=>s.length>0):Array.isArray(e)&&(t=e.map(s=>String(s).trim()).filter(s=>s.length>0)),t.length===0?"":t.length===1?t[0]:t}addFindReplacePair(){try{this.newRule.findReplacePairs||(this.newRule.findReplacePairs=[]),this.newRule.findReplacePairs.push({find:"",replace:"",useRegex:!1}),this.updateModalPairs()}catch(e){console.error("Error adding find/replace pair:",e)}}removeFindReplacePair(e){try{if(!this.newRule.findReplacePairs||this.newRule.findReplacePairs.length<=1)return;e>=0&&e<this.newRule.findReplacePairs.length&&(this.newRule.findReplacePairs.splice(e,1),this.updateModalPairs())}catch(t){console.error("Error removing find/replace pair:",t)}}addJsonField(){this.newRule.jsonFields||(this.newRule.jsonFields=[]),this.newRule.jsonFields.push({action:"set",path:"",value:"",newName:""}),this.updateJsonFieldsList()}removeJsonField(e){this.newRule.jsonFields&&e>=0&&e<this.newRule.jsonFields.length&&(this.newRule.jsonFields.splice(e,1),this.updateJsonFieldsList())}addHeaderRule(){this.newRule.headerRules||(this.newRule.headerRules=[]),this.newRule.headerRules.push({action:"set",header:"",value:"",newName:""}),this.updateHeaderRulesList()}removeHeaderRule(e){this.newRule.headerRules&&e>=0&&e<this.newRule.headerRules.length&&(this.newRule.headerRules.splice(e,1),this.updateHeaderRulesList())}updateJsonFieldsList(){let e=document.querySelector(".json-fields-list");if(!e)return;let t=this.newRule.jsonFields||[];t.length===0?e.innerHTML='<div class="empty-hint">No JSON field modifications. Click "+ Add Field" to add one.</div>':e.innerHTML=t.map((s,a)=>`
				<div class="json-field-row" data-field-idx="${a}">
					<select name="jsonField-${a}-action" class="form-input form-input-sm" style="width:auto;min-width:80px">
						<option value="set" ${s.action==="set"?"selected":""}>Set</option>
						<option value="delete" ${s.action==="delete"?"selected":""}>Delete</option>
						<option value="rename" ${s.action==="rename"?"selected":""}>Rename</option>
					</select>
					<input type="text" name="jsonField-${a}-path" class="form-input form-input-sm" placeholder="json.path (e.g. user.name)" value="${this.escapeHtml(s.path||"")}">
					<input type="text" name="jsonField-${a}-value" class="form-input form-input-sm json-field-value" placeholder="Value" value="${this.escapeHtml(s.value||"")}">
					${s.action==="rename"?`<input type="text" name="jsonField-${a}-newName" class="form-input form-input-sm" placeholder="New key name" value="${this.escapeHtml(s.newName||"")}">`:""}
					<button type="button" class="btn btn-icon btn-secondary btn-sm btn-remove-json-field" data-field-idx="${a}" title="Remove field">\u2715</button>
				</div>
			`).join("")}updateHeaderRulesList(){let e=document.querySelector(".header-rules-list");if(!e)return;let t=this.newRule.headerRules||[];t.length===0?e.innerHTML='<div class="empty-hint">No header modifications. Click "+ Add Header Rule" to add one.</div>':e.innerHTML=t.map((s,a)=>`
				<div class="header-rule-row" data-header-idx="${a}">
					<select name="headerRule-${a}-action" class="form-input form-input-sm" style="width:auto;min-width:80px">
						<option value="set" ${s.action==="set"?"selected":""}>Set/Add</option>
						<option value="remove" ${s.action==="remove"?"selected":""}>Remove</option>
						<option value="rename" ${s.action==="rename"?"selected":""}>Rename</option>
					</select>
					<input type="text" name="headerRule-${a}-header" class="form-input form-input-sm" placeholder="Header name" value="${this.escapeHtml(s.header||"")}">
					<input type="text" name="headerRule-${a}-value" class="form-input form-input-sm header-rule-value" placeholder="Value" value="${this.escapeHtml(s.value||"")}">
					${s.action==="rename"?`<input type="text" name="headerRule-${a}-newName" class="form-input form-input-sm" placeholder="New name" value="${this.escapeHtml(s.newName||"")}">`:""}
					<button type="button" class="btn btn-icon btn-secondary btn-sm btn-remove-header-rule" data-header-idx="${a}" title="Remove">\u2715</button>
				</div>
			`).join("")}updateModalPairs(){try{let e=document.querySelector(".find-replace-pairs-list");if(!e){console.warn("Pairs list element not found");return}if(!this.newRule.findReplacePairs||!Array.isArray(this.newRule.findReplacePairs)){console.warn("Invalid findReplacePairs data");return}let t=this.newRule.findReplacePairs.map((s,a)=>{let i={find:s?.find||"",replace:s?.replace||"",useRegex:!!s?.useRegex};return`
					<div class="find-replace-pair">
						<label>Find (text or regex)</label>
						<textarea name="pair-${a}-find" class="form-input" rows="2" placeholder="Enter text or regex pattern to find">${this.escapeHtml(i.find)}</textarea>
						<label>Replace</label>
						<textarea name="pair-${a}-replace" class="form-input" rows="2" placeholder="Enter replacement text (Use $rand{num,num} to randomize numbers)">${this.escapeHtml(i.replace)}</textarea>
						<div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
							<label class="form-checkbox">
								<input type="checkbox" name="pair-${a}-useRegex" ${i.useRegex?"checked":""} />
								<span>USE REGEX</span>
							</label>
							${this.newRule.findReplacePairs.length>1?`<button type="button" class="btn btn-icon btn-secondary btn-remove-pair" data-pair-idx="${a}" title="Remove pair">\u274C</button>`:""}
						</div>
					</div>
				`}).join("");e.innerHTML=t}catch(e){console.error("Error updating modal pairs:",e)}}refreshModal(){let e=document.querySelector(".modal-overlay");e&&e.remove(),document.body.insertAdjacentHTML("beforeend",this.getModal()),requestAnimationFrame(()=>{let t=document.querySelector(".modal-overlay");t&&t.classList.add("show")})}async toggleDefaultRules(){let e=document.querySelector(".default-rules-toggle");e&&(e.style.pointerEvents="none",e.style.opacity="0.7");try{if(this.state.defaultRulesEnabled){let t=await this.sendMessage({action:"clearDefaults"});t&&t.success&&(this.state.defaultRulesEnabled=!1,e&&e.classList.remove("active"),this.state.rules=this.state.rules.filter(s=>!s.isDefault),this.updateRulesDisplay())}else{let t=await this.sendMessage({action:"loadDefaults"});t&&t.success&&(this.state.defaultRulesEnabled=!0,e&&e.classList.add("active"),await this.refreshDataAndUpdateDisplay())}}finally{e&&(e.style.pointerEvents="",e.style.opacity="")}}async clearStats(){let e=await this.sendMessage({action:"clearStats"});e&&e.success&&await this.refreshDataAndUpdateDisplay()}async exportCustomRules(){try{let e=await this.sendMessage({action:"exportRules"});if(e&&e.success&&e.data){let t=e.data;if((t.rules?t.rules.length:0)===0){this.showErrorMessage("No custom rules to export");return}let a=JSON.stringify(t,null,2),i=new Blob([a],{type:"application/json"}),n=URL.createObjectURL(i),r=document.createElement("a");r.href=n;let o=new Date().toISOString().split("T")[0];r.download=`request-interceptor-rules-${o}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),setTimeout(()=>URL.revokeObjectURL(n),1e3)}else this.showErrorMessage("Failed to export rules")}catch{this.showErrorMessage("Failed to export rules")}}async importCustomRules(e){try{let t=e.files[0];if(!t)return;let s=await t.text(),a;try{a=JSON.parse(s)}catch{this.showErrorMessage("Invalid JSON file"),e.value="";return}let i=await this.sendMessage({action:"importRules",data:a});i&&i.success?(await this.refreshData(),this.showSuccessMessage("Custom rules imported successfully")):this.showErrorMessage("Failed to import rules. Check file format."),e.value=""}catch(t){console.error("Error importing rules:",t),this.showErrorMessage("Failed to import rules")}}render(){let e=document.getElementById("root");this.state.loading?e.innerHTML=this.getLoadingSkeleton():e.innerHTML=this.getHTML()}getLoadingSkeleton(){return`
      <div class="popup-container">
        <div class="header skeleton-header">
          <div class="skeleton-line skeleton-title"></div>
          <div class="skeleton-circle"></div>
        </div>
        <div class="main-content">
          <div class="skeleton-card">
            <div class="skeleton-line skeleton-heading"></div>
            <div class="skeleton-grid">
              <div class="skeleton-stat"></div>
              <div class="skeleton-stat"></div>
              <div class="skeleton-stat"></div>
              <div class="skeleton-stat"></div>
            </div>
          </div>
          <div class="skeleton-card">
            <div class="skeleton-line skeleton-heading"></div>
            <div class="skeleton-row"></div>
            <div class="skeleton-row skeleton-row-short"></div>
          </div>
          <div class="skeleton-card">
            <div class="skeleton-line skeleton-heading"></div>
            <div class="skeleton-row"></div>
            <div class="skeleton-row skeleton-row-short"></div>
          </div>
          <div class="skeleton-loading-text">
            <span class="skeleton-dot">\u25CF</span>
            <span class="skeleton-dot">\u25CF</span>
            <span class="skeleton-dot">\u25CF</span>
            <span>Loading rules\u2026</span>
          </div>
        </div>
      </div>
    `}getHTML(){return`
      <div class="popup-container">
        ${this.getHeader()}
        ${this.getMainContent()}
      </div>
    `}getHeader(){return`
      <div class="header">
        <div class="header-title">
          <img src="../images/icon.png" alt="RI" class="logo-img">
          <span>Request Interceptor</span>
          <div class="header-badge">${this.state.version?"v"+this.escapeHtml(String(this.state.version)):""}</div>
        </div>
        <div class="header-controls">
          <div class="toggle-switch ${this.state.isEnabled?"active":""}" title="Enable/Disable extension">
            <div class="toggle-switch-thumb"></div>
          </div>
        </div>
      </div>
      ${this.state.versionError?`
      <div class="version-error-banner">
        \u26A0\uFE0F ${this.escapeHtml(this.state.versionError.message)}
        ${this.state.versionError.minVersion?`(Required: ${this.escapeHtml(this.state.versionError.minVersion)})`:""}
      </div>`:""}
    `}getMainContent(){return`
      <div class="main-content">
        ${this.getStatusCard()}
        ${this.getRulesSection()}
        ${this.getActionsSection()}
        ${this.getActivitySection()}
      </div>
    `}getStatusCard(){return`
      <div class="status-card">
        <div class="status-header">
          <div class="status-title">Interception Status</div>
          <div class="status-indicator">
            <div class="status-dot ${this.state.isEnabled?"active":""}"></div>
            <span class="status-text">${this.state.isEnabled?"Active":"Inactive"}</span>
          </div>
        </div>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">${this.state.stats.modifiedRequests}</span>
            <span class="stat-label">Modified</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${this.state.stats.urlModifications}</span>
            <span class="stat-label">URL</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${this.state.stats.postModifications}</span>
            <span class="stat-label">POST</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${this.state.stats.responseModifications}</span>
            <span class="stat-label">Response</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${this.state.stats.blockedRequests??0}</span>
            <span class="stat-label">Blocked</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${this.state.stats.headerModifications??0}</span>
            <span class="stat-label">Headers</span>
          </div>
        </div>
      </div>
    `}getRulesSection(){let e=this.state.rules.filter(s=>s.isDefault),t=this.state.rules.filter(s=>!s.isDefault);return`
      <div class="rules-section">
        <div class="section-header">
          <div class="section-title">Rules Management</div>
        </div>
        
        <div class="rules-panels">
          <div class="panel-card default-panel">
            <div class="panel-header">
              <div class="panel-info">
                <h3>Default Rules</h3>
                <p>Default rules \u2022 <span class="panel-count">${e.filter(s=>s.enabled!==!1).length}</span> active</p>
              </div>
              <div class="panel-controls">
                <div class="toggle-switch default-rules-toggle ${this.state.defaultRulesEnabled?"active":""}" title="Toggle default rules">
                  <div class="toggle-switch-thumb"></div>
                </div>
                <button class="btn btn-secondary btn-sm btn-view-defaults" data-panel="default">
                  View
                </button>
              </div>
            </div>
          </div>
          
          <div class="panel-card custom-panel">
            <div class="panel-header">
              <div class="panel-info">
                <h3>Your Rules</h3>
                <p>Your rules \u2022 <span class="panel-count">${t.filter(s=>s.enabled!==!1).length}</span> active</p>
              </div>
              <div class="panel-controls">
                <button class="btn btn-primary btn-sm btn-add-rule">+ Add</button>
                <button class="btn btn-secondary btn-sm btn-view-customs" data-panel="custom">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}getDefaultRulesPanel(e){let t=this.state.categories||[],s=this.state.activeCategory||"all",a=`<button class="category-tab ${s==="all"?"active":""}" data-category="all" style="--tab-color:#888">All (${e.length})</button>`;for(let n of t){let r=e.filter(o=>o.category===n.id).length;r>0&&(a+=`<button class="category-tab ${s===n.id?"active":""}" data-category="${this.escapeHtml(n.id)}" style="--tab-color:${this.escapeHtml(n.color||"#888")}">${this.escapeHtml(n.name)} (${r})</button>`)}let i=s==="all"?e:e.filter(n=>n.category===s);return`
      <div class="rules-panel-overlay" data-panel="default">
        <div class="rules-panel">
          <div class="panel-header-full">
            <h3>Default Rules</h3>
            <button class="btn btn-icon btn-secondary btn-close-panel" data-panel="default">\u2715</button>
          </div>
          ${t.length>0?`<div class="category-tabs">${a}</div>`:""}
          <div class="panel-content">
            ${i.length>0?`
            <div class="rules-list-panel">
              ${i.map(n=>this.getCompactRuleItem(n)).join("")}
            </div>
            `:`
            <div class="empty-state-compact">
              <span class="empty-text">No rules in this category</span>
            </div>
            `}
          </div>
        </div>
      </div>
    `}getCustomRulesPanel(e){return`
      <div class="rules-panel-overlay" data-panel="custom">
        <div class="rules-panel">
          <div class="panel-header-full">
            <h3>Your Rules</h3>
            <button class="btn btn-icon btn-secondary btn-close-panel" data-panel="custom">\u2715</button>
          </div>
          <div class="panel-content">
            ${e.length>0?`
            <div class="rules-list-panel">
              ${e.map(t=>this.getRuleItem(t)).join("")}
            </div>
            `:`
            <div class="empty-state">
              <div class="empty-state-icon">\u{1F4DD}</div>
              <div class="empty-state-text">No custom rules configured</div>
              <button class="btn btn-primary btn-add-rule">Create your first rule</button>
            </div>
            `}
          </div>
        </div>
      </div>
    `}_getTargetTypeBadge(e){return{all:"ALL",post:"POST",url:"URL",response:"RESP",block:"BLOCK",headers:"HDR",jsonBody:"JSON",base64:"B64"}[e]||""}getCompactRuleItem(e){if(e._protected){let r="";return e.description&&(r=`<span class="rule-compact-description">${this.escapeHtml(e.description)}</span>`),`
      <div class="rule-item-compact ${e.enabled?"enabled":"disabled"}">
        <div class="rule-compact-header">
          <div class="rule-toggle-small ${e.enabled?"active":""}" 
               data-rule-id="${e.id}" 
               title="${e.enabled?"Disable":"Enable"} rule">
            <div class="rule-toggle-small-thumb"></div>
          </div>
          <div class="rule-compact-info">
            <span class="rule-compact-title">\u{1F512} ${this.escapeHtml(e.title||"Protected Rule")}</span>
            ${r}
          </div>
        </div>
      </div>
    `}let t=[],s=this._getTargetTypeBadge(e.targetType);s&&t.push(s),e.findReplacePairs&&e.findReplacePairs.length>0&&e.findReplacePairs.some(r=>r.useRegex)&&t.push("REGEX"),e.urlMatch&&(Array.isArray(e.urlMatch)?e.urlMatch.length>0:e.urlMatch.trim()!=="")&&t.push("MATCH");let n=t.join(" \u2022 ");return`
      <div class="rule-item-compact ${e.enabled?"enabled":"disabled"}">
        <div class="rule-compact-header">
          <div class="rule-toggle-small ${e.enabled?"active":""}" 
               data-rule-id="${e.id}" 
               title="${e.enabled?"Disable":"Enable"} rule">
            <div class="rule-toggle-small-thumb"></div>
          </div>
          <div class="rule-compact-info">
            <span class="rule-compact-title">${this.escapeHtml(e.title||"Untitled Rule")}</span>
            <span class="rule-compact-type">${n}</span>
          </div>
        </div>        ${e.description?`<div class="rule-compact-description">${this.escapeHtml(e.description)}</div>`:""}
      </div>
    `}getRuleItem(e){let t=e.title||"Untitled Rule",s=e.isDefault,a=e._protected,i="",n="",r=!1,o=0;e.findReplacePairs&&e.findReplacePairs.length>0&&(i=e.findReplacePairs[0].find,n=e.findReplacePairs[0].replace,r=e.findReplacePairs.some(u=>u.useRegex),o=e.findReplacePairs.length);let d=[],p=this._getTargetTypeBadge(e.targetType);p&&d.push(p),r&&d.push("REGEX"),e.urlMatch&&(Array.isArray(e.urlMatch)?e.urlMatch.length>0:e.urlMatch.trim()!=="")&&d.push("MATCH");let h=d.join(" \u2022 "),l=Array.isArray(e.urlMatch)?e.urlMatch.join(", "):e.urlMatch||"",c=o>1?` +${o-1} more`:"";return`
      <div class="rule-item ${s?"rule-item-default":"rule-item-custom"} ${e.enabled?"enabled":"disabled"}">
        <div class="rule-header">
          <div class="rule-toggle-small ${e.enabled?"active":""}" 
               data-rule-id="${e.id}" 
               title="${e.enabled?"Disable":"Enable"} rule">
            <div class="rule-toggle-small-thumb"></div>
          </div>
          <div class="rule-info">
            <div class="rule-title-row">
              <span class="rule-title">${a?"\u{1F512} ":""}${this.escapeHtml(t)}</span>
              <div class="rule-actions">
                ${!s&&!a?`
                <button class="btn btn-icon btn-xs btn-move-up" data-rule-id="${e.id}" title="Move up">\u25B2</button>
                <button class="btn btn-icon btn-xs btn-move-down" data-rule-id="${e.id}" title="Move down">\u25BC</button>
                `:""}
                ${a?"":`
                <button class="btn btn-icon btn-secondary btn-edit-rule" data-rule-id="${e.id}" title="Edit">\u270F\uFE0F</button>
                <button class="btn btn-icon btn-secondary btn-delete-rule" data-rule-id="${e.id}" title="Delete">\u2716</button>
                `}
              </div>
            </div>
            <div class="rule-meta">
              <span class="rule-type-badge">${a?"\u{1F512} PROTECTED":h}</span>
              ${a?'<span class="rule-desc">Rule body is encrypted \u2014 cannot be viewed or exported</span>':""}
              ${e.description?`<span class="rule-desc">${this.escapeHtml(e.description)}</span>`:""}
            </div>
          </div>
        </div>
        ${a?"":`
        ${l?`<div class="rule-url-line"><span>\u{1F517}</span><code>${this.escapeHtml(l)}</code></div>`:""}
        <div class="rule-patterns">
          <div class="pattern-row">
            <span class="pattern-label">FIND</span>
            <code>${this.escapeHtml(i)}</code>
          </div>
          ${n?`
          <div class="pattern-row">
            <span class="pattern-label">REPL</span>
            <code>${this.escapeHtml(n)}</code>
          </div>
          `:""}
          ${c?`<div class="pattern-more">${c}</div>`:""}
        </div>
        `}
      </div>
    `}getActionsSection(){return`
      <div class="section-header mt-4">
        <div class="section-title">Quick Actions</div>
      </div>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button class="btn btn-secondary btn-sm btn-clear-stats">Clear Statistics</button>
        <button class="btn btn-secondary btn-sm btn-clear-activity">Clear Activity</button>
        <button class="btn btn-secondary btn-sm btn-export-rules">Export Custom Rules</button>
        <button class="btn btn-secondary btn-sm btn-import-rules">Import Custom Rules</button>
        <input type="file" id="import-file-input" accept=".json" style="display:none">
      </div>
    `}getActivitySection(){let e=this.state.activityLog||[];return`
      <div class="activity-log-section mt-4">
        <div class="section-header">
          <div class="section-title">Activity Log</div>
          <span class="activity-count">${e.length} entries</span>
        </div>
        <div class="activity-log-list">
          ${e.length>0?e.map(t=>this.getActivityEntry(t)).join(""):this.getActivityEmptyState()}
        </div>
      </div>
    `}getActivityEmptyState(){return'<div class="activity-empty">No activity yet \u2014 modifications will appear here in real time</div>'}getActivityEntry(e){let t={url:"URL",post:"POST",response:"RESP",block:"BLOCK",headers:"HDR"}[e.type]||e.type.toUpperCase(),s={url:"url",post:"post",response:"response",block:"block",headers:"headers"}[e.type]||"",a=(e.rules||[]).join(", ")||"Unknown rule",i=this.formatTimeAgo(e.timestamp),n=e.url||"";return`
      <div class="activity-entry">
        <span class="activity-badge ${s}">${t}</span>
        <span class="activity-rules">${this.escapeHtml(a)}</span>
        ${n?`<span class="activity-url" title="${this.escapeHtml(n)}">${this.escapeHtml(n)}</span>`:""}
        <span class="activity-time">${i}</span>
      </div>
    `}formatTimeAgo(e){let t=Math.floor((Date.now()-e)/1e3);if(t<5)return"just now";if(t<60)return t+"s ago";let s=Math.floor(t/60);if(s<60)return s+"m ago";let a=Math.floor(s/60);return a<24?a+"h ago":Math.floor(a/24)+"d ago"}getModal(){let e=this.newRule.findReplacePairs.map((t,s)=>`
      <div class="find-replace-pair">
        <label>Find (text or regex)</label>
        <textarea name="pair-${s}-find" class="form-input" rows="2" placeholder="Enter text or regex pattern to find">${this.escapeHtml(t.find)}</textarea>
        <label>Replace</label>
        <textarea name="pair-${s}-replace" class="form-input" rows="2" placeholder="Use $rand{num,num} to randomize numbers (leave empty to remove)">${this.escapeHtml(t.replace)}</textarea>
        <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
          <label class="form-checkbox">
            <input type="checkbox" name="pair-${s}-useRegex" ${t.useRegex?"checked":""} />
            <span>Use Regex</span>
          </label>
          ${this.newRule.findReplacePairs.length>1?`<button type="button" class="btn btn-icon btn-secondary btn-remove-pair" data-pair-idx="${s}" title="Remove pair">\u274C</button>`:""}
        </div>
      </div>
    `).join("");return`
      <div class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">
              ${this.state.editingRule?"Edit Rule":"Add New Rule"}
            </div>
            <button class="btn btn-icon btn-secondary btn-cancel">\u2715</button>
          </div>
          <form class="rule-form" id="rule-form">
            <div class="form-group">
              <label class="form-label">Rule Title</label>
              <input type="text" name="title" class="form-input" value="${this.escapeHtml(this.newRule.title)}" placeholder="Enter a descriptive title for this rule">
            </div>
            <div style="display:flex; gap:12px;">
              <div class="form-group" style="flex:1;">
                <label class="form-label">Target</label>
                <select name="targetType" class="form-input" id="target-type-select">
                  <option value="url" ${this.newRule.targetType==="url"?"selected":""}>URL</option>
                  <option value="post" ${this.newRule.targetType==="post"?"selected":""}>POST Body</option>
                  <option value="response" ${this.newRule.targetType==="response"?"selected":""}>Response Body</option>
                  <option value="jsonBody" ${this.newRule.targetType==="jsonBody"?"selected":""}>JSON Body (Fields)</option>
                  <option value="base64" ${this.newRule.targetType==="base64"?"selected":""}>Base64 Body</option>
                  <option value="headers" ${this.newRule.targetType==="headers"?"selected":""}>Headers</option>
                  <option value="block" ${this.newRule.targetType==="block"?"selected":""}>Block Request</option>
                  <option value="all" ${this.newRule.targetType==="all"?"selected":""}>All</option>
                </select>
              </div>
              <div class="form-group" style="flex:1;">
                <label class="form-label">Category</label>
                <select name="category" class="form-input">
                  <option value="">None</option>
                  ${this.state.categories.map(t=>`<option value="${this.escapeHtml(t.id)}" ${(this.newRule.category||"")===t.id?"selected":""}>${this.escapeHtml(t.name)}</option>`).join("")}
                </select>
              </div>
            </div>
            <div class="form-group find-replace-group">
              <label class="form-label">Find & Replace Pairs</label>
              <div class="find-replace-pairs-list">${e}</div>
              <button type="button" class="btn btn-secondary btn-sm btn-add-pair mt-2">+ Add Another Pair</button>
            </div>
            ${this.getJsonFieldsEditor()}
            ${this.getHeaderRulesEditor()}
            <div class="form-group">
              <label class="form-label">Description</label>
              <input type="text" name="description" class="form-input" value="${this.escapeHtml(this.newRule.description)}" placeholder="Brief description of what this rule does">
            </div>
            <div class="form-group">
              <label class="form-label">URL Match</label>
              <textarea name="urlMatch" class="form-input" rows="3" placeholder="URL pattern(s) with wildcard support (e.g., 'api.example.com/*')
Enter one pattern per line for multiple URLs">${this.escapeHtml(Array.isArray(this.newRule.urlMatch)?this.newRule.urlMatch.join(`
`):this.newRule.urlMatch||"")}</textarea>
              <small style="font-size: 11px; color: var(--text-muted); margin-top: 6px; display: block;">Leave empty to apply to all URLs. Enter one URL pattern per line to match multiple URLs. Supports wildcards (*) for flexible matching.</small>
            </div>
          </form>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary btn-cancel">Cancel</button>
            <button type="submit" class="btn btn-primary" form="rule-form">${this.state.editingRule?"Update Rule":"Add Rule"}</button>
          </div>
        </div>
      </div>
    `}getJsonFieldsEditor(){return`
			<div class="form-group json-fields-group">
				<label class="form-label">JSON Field Modifications</label>
				<div class="json-fields-list">${(this.newRule.jsonFields||[]).map((s,a)=>`
			<div class="json-field-row" data-field-idx="${a}">
				<select name="jsonField-${a}-action" class="form-input form-input-sm" style="width:auto;min-width:80px">
					<option value="set" ${s.action==="set"?"selected":""}>Set</option>
					<option value="delete" ${s.action==="delete"?"selected":""}>Delete</option>
					<option value="rename" ${s.action==="rename"?"selected":""}>Rename</option>
				</select>
				<input type="text" name="jsonField-${a}-path" class="form-input form-input-sm" placeholder="json.path (e.g. user.name)" value="${this.escapeHtml(s.path||"")}">
				<input type="text" name="jsonField-${a}-value" class="form-input form-input-sm json-field-value" placeholder="Value" value="${this.escapeHtml(s.value||"")}">
				${s.action==="rename"?`<input type="text" name="jsonField-${a}-newName" class="form-input form-input-sm" placeholder="New key name" value="${this.escapeHtml(s.newName||"")}">`:""}
				<button type="button" class="btn btn-icon btn-secondary btn-sm btn-remove-json-field" data-field-idx="${a}" title="Remove field">\u2715</button>
			</div>
		`).join("")||'<div class="empty-hint">No JSON field modifications. Click "+ Add Field" to add one.</div>'}</div>
				<button type="button" class="btn btn-secondary btn-sm btn-add-json-field mt-2">+ Add Field</button>
			</div>
		`}getHeaderRulesEditor(){return`
			<div class="form-group header-rules-group">
				<label class="form-label">Header Modifications</label>
				<div class="header-rules-list">${(this.newRule.headerRules||[]).map((s,a)=>`
			<div class="header-rule-row" data-header-idx="${a}">
				<select name="headerRule-${a}-action" class="form-input form-input-sm" style="width:auto;min-width:80px">
					<option value="set" ${s.action==="set"?"selected":""}>Set/Add</option>
					<option value="remove" ${s.action==="remove"?"selected":""}>Remove</option>
					<option value="rename" ${s.action==="rename"?"selected":""}>Rename</option>
				</select>
				<input type="text" name="headerRule-${a}-header" class="form-input form-input-sm" placeholder="Header name" value="${this.escapeHtml(s.header||"")}">
				<input type="text" name="headerRule-${a}-value" class="form-input form-input-sm header-rule-value" placeholder="Value" value="${this.escapeHtml(s.value||"")}">
				${s.action==="rename"?`<input type="text" name="headerRule-${a}-newName" class="form-input form-input-sm" placeholder="New name" value="${this.escapeHtml(s.newName||"")}">`:""}
				<button type="button" class="btn btn-icon btn-secondary btn-sm btn-remove-header-rule" data-header-idx="${a}" title="Remove">\u2715</button>
			</div>
		`).join("")||'<div class="empty-hint">No header modifications. Click "+ Add Header Rule" to add one.</div>'}</div>
				<button type="button" class="btn btn-secondary btn-sm btn-add-header-rule mt-2">+ Add Header Rule</button>
			</div>
		`}escapeHtml(e){try{if(e==null)return"";let t=document.createElement("div");return t.textContent=String(e),t.innerHTML}catch(t){return console.error("Error escaping HTML:",t),""}}showSuccessAnimation(e){e&&(e.classList.add("success-animation"),setTimeout(()=>{e.classList.remove("success-animation")},600))}showSuccessMessage(e){try{let t=document.getElementById("root");if(!t){console.log("Success:",e);return}let s=document.createElement("div");s.className="success-message",s.style.cssText=`
				background: var(--success, #28a745);
				color: white;
				padding: 12px;
				margin: 8px;
				border-radius: 6px;
				font-size: 12px;
				box-shadow: 0 2px 4px rgba(0,0,0,0.1);
				z-index: 1000;
				position: relative;
			`,s.textContent=e,t.querySelectorAll(".success-message").forEach(a=>a.remove()),t.insertBefore(s,t.firstChild),setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},4e3)}catch(t){console.error("Error displaying success message:",t),console.log("Success:",e)}}showErrorMessage(e){try{let t=document.getElementById("root");if(!t){console.error("Error:",e);return}let s=document.createElement("div");s.className="error-message",s.style.cssText=`
				background: var(--danger, #dc3545);
				color: white;
				padding: 12px;
				margin: 8px;
				border-radius: 6px;
				font-size: 12px;
				box-shadow: 0 2px 4px rgba(0,0,0,0.1);
				z-index: 1000;
				position: relative;
			`,s.textContent=e,t.querySelectorAll(".error-message").forEach(a=>a.remove()),t.insertBefore(s,t.firstChild),setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},5e3)}catch(t){console.error("Error displaying error message:",t),console.error("Extension error:",e)}}};document.addEventListener("DOMContentLoaded",()=>{let f=new m;window.addEventListener("beforeunload",()=>{f.cleanup()})});})();
