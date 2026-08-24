(()=>{var y=class{constructor(){try{this.state={isEnabled:!1,rules:[],loading:!0,version:null,versionError:null,stats:{modifiedRequests:0,urlModifications:0,postModifications:0,responseModifications:0,blockedRequests:0,headerModifications:0},activityLog:[],ruleStats:{},ruleSearch:"",presets:[],cookies:[],cookiesUrl:"",showAddRule:!1,editingRule:null,defaultRulesEnabled:!0,showDefaultRulesPanel:!1,showCustomRulesPanel:!1,categories:[],activeCategory:"all"},this.newRule=this.getDefaultNewRule(),this._newRuleSnapshot=JSON.stringify(this.newRule),this.init()}catch(e){console.error("Error initializing RequestModifierPopup:",e)}}async init(){this.setupEventListeners(),this.render(),await this.refreshData(),this.startAutoRefresh()}cleanup(){this.stopAutoRefresh()}setupEventListeners(){document.addEventListener("click",e=>{let t=e.target;if((t.matches(".toggle-switch")||t.closest(".toggle-switch"))&&!t.matches(".default-rules-toggle")&&!t.closest(".default-rules-toggle")){e.preventDefault(),e.stopPropagation(),this.toggleEnabled();return}if(t.matches(".default-rules-toggle")||t.closest(".default-rules-toggle")){e.preventDefault(),e.stopPropagation(),this.toggleDefaultRules();return}if(t.matches(".rule-toggle-small")||t.closest(".rule-toggle-small")){e.preventDefault(),e.stopPropagation();let s=t.getAttribute("data-rule-id")||t.closest(".rule-toggle-small").getAttribute("data-rule-id");this.toggleRule(s);return}if(t.matches(".activity-url")){t.classList.toggle("expanded");return}if(t.matches(".btn-edit-rule")){this.editRule(t.getAttribute("data-rule-id"));return}if(t.matches(".btn-move-up")){this.moveRule(t.getAttribute("data-rule-id"),-1);return}if(t.matches(".btn-move-down")){this.moveRule(t.getAttribute("data-rule-id"),1);return}if(t.matches(".btn-delete-rule")){this.deleteRule(t.getAttribute("data-rule-id"));return}if(t.matches(".btn-add-rule")){this.showAddRuleModal();return}if(t.matches(".btn-cancel")){this.hideModal();return}if(t.matches(".btn-undo")){this.undo();return}if(t.matches(".btn-clear-stats")){this.clearStats();return}if(t.matches(".btn-clear-activity")){this.clearActivityLog();return}if(t.matches(".btn-export-rules")){this.exportCustomRules();return}if(t.matches(".btn-import-rules")){document.getElementById("import-file-input").click();return}if(t.matches(".btn-save-preset")){this.savePreset();return}if(t.matches(".btn-load-preset")){this.loadPreset();return}if(t.matches(".btn-delete-preset")){this.deletePreset();return}if(t.matches(".btn-toggle-group")){this.toggleGroup(t.getAttribute("data-group"),t.getAttribute("data-enabled")==="0");return}if(t.matches(".btn-view-cookies")){this.showCookiesPanel();return}if(t.matches(".btn-close-cookies")){this.closeCookiesPanel();return}if(t.matches(".btn-add-cookie")){this.addCookie();return}if(t.matches(".btn-cookie-delete")){this.deleteCookie(t.getAttribute("data-name"));return}if(t.matches(".btn-test-rules")){this.showRuleTester();return}if(t.matches(".btn-close-tester")){let s=document.querySelector(".tester-panel-overlay");s&&s.remove();return}if(t.matches(".btn-run-tester")){this.runRuleTester();return}if(t.matches(".btn-view-defaults")){this.showDefaultRulesPanel();return}if(t.matches(".btn-view-customs")){this.showCustomRulesPanel();return}if(t.matches(".btn-close-panel")){this.closePanels(t.getAttribute("data-panel"));return}if(t.matches(".category-tab")){this.state.activeCategory=t.getAttribute("data-category"),this.updateRulesDisplay();return}if(t.matches(".btn-add-pair")){e.preventDefault(),this.addFindReplacePair();return}if(t.matches(".btn-remove-pair")){e.preventDefault(),this.removeFindReplacePair(parseInt(t.getAttribute("data-pair-idx"),10));return}if(t.matches(".btn-add-json-field")){e.preventDefault(),this.addJsonField();return}if(t.matches(".btn-remove-json-field")){e.preventDefault(),this.removeJsonField(parseInt(t.getAttribute("data-field-idx"),10));return}if(t.matches(".btn-add-header-rule")){e.preventDefault(),this.addHeaderRule();return}if(t.matches(".btn-remove-header-rule")){e.preventDefault(),this.removeHeaderRule(parseInt(t.getAttribute("data-header-idx"),10));return}if(t.matches(".btn-add-url-param")){e.preventDefault(),this.addUrlParam();return}if(t.matches(".btn-remove-url-param")){e.preventDefault(),this.removeUrlParam(parseInt(t.getAttribute("data-param-idx"),10));return}if(t.matches(".rules-panel-overlay")){let s=t.getAttribute("data-panel");s&&this.closePanels(s);return}}),document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;if(this.state.showAddRule){this.hideModal();return}let t=document.querySelectorAll(".rules-panel-overlay, .cookies-panel-overlay, .tester-panel-overlay");if(t.length>0){for(let s of t)s.remove();this.state.showDefaultRulesPanel=!1,this.state.showCustomRulesPanel=!1,this.state.showCookiesPanel=!1}}),document.addEventListener("submit",e=>{e.target.matches(".rule-form")&&(e.preventDefault(),this.saveRule())}),document.addEventListener("input",e=>{if(e.target.matches("#rule-search")){this.state.ruleSearch=e.target.value,this.updateRulesDisplay();return}e.target.matches(".form-input, .form-select")?this.updateFormField(e.target.name,e.target.value):e.target.matches(".form-checkbox input")&&this.updateFormField(e.target.name,e.target.checked)}),document.addEventListener("change",e=>{e.target.matches("#import-file-input")?this.importCustomRules(e.target):e.target.matches('.find-replace-pair input[type="checkbox"]')?this.updateFormField(e.target.name,e.target.checked):e.target.matches("select.form-input")&&(this.updateFormField(e.target.name,e.target.value),e.target.name.startsWith("jsonField-")&&e.target.name.endsWith("-action")?this.updateJsonFieldsList():e.target.name.startsWith("headerRule-")&&e.target.name.endsWith("-action")?this.updateHeaderRulesList():e.target.name.startsWith("urlParam-")&&e.target.name.endsWith("-action")?this.updateUrlParamsList():e.target.name==="targetType"&&this.refreshModal())})}async refreshData(e=0){try{let a=await this.sendMessage({action:"getStatus"});if(a){if(this.state.isEnabled=a.isEnabled,this.state.rules=a.rules||[],this.state.stats=a.stats||this.state.stats,this.state.activityLog=a.activityLog||[],this.state.ruleStats=a.ruleStats||{},this.state.presets=a.presets||[],this.state.defaultRulesEnabled=a.hasDefaultRules||!1,this.state.categories=a.categories||[],this.state.version=a.version||null,this.state.versionError=a.versionError||null,this.state.rules.length===0&&this.state.defaultRulesEnabled&&e<10){setTimeout(()=>this.refreshData(e+1),600);return}this.state.loading=!1,this.render()}else e<10?setTimeout(()=>this.refreshData(e+1),600):(this.state.loading=!1,this.render(),this.showErrorMessage("Failed to connect to extension background script"))}catch{if(e<3){setTimeout(()=>this.refreshData(e+1),600);return}this.state.loading=!1,this.showErrorMessage("Failed to connect to extension background script")}}startAutoRefresh(){this.autoRefreshInterval=setInterval(()=>{this.refreshDataAndUpdateDisplay()},5e3)}stopAutoRefresh(){this.autoRefreshInterval&&(clearInterval(this.autoRefreshInterval),this.autoRefreshInterval=null)}async sendMessage(e){return new Promise(t=>{try{chrome.runtime.sendMessage(e,s=>{chrome.runtime.lastError?(console.error("Chrome runtime error:",chrome.runtime.lastError),t(null)):t(s)})}catch(s){console.error("Error sending message:",s),t(null)}})}async toggleEnabled(){try{let e=await this.sendMessage({action:"toggleEnabled"});if(e&&e.isEnabled!==void 0){this.state.isEnabled=e.isEnabled,this.updateStatusDisplay();let t=document.querySelector(".header-controls .toggle-switch:not(.default-rules-toggle)");t&&(this.state.isEnabled?t.classList.add("active"):t.classList.remove("active"),this.showSuccessAnimation(t))}else this.showErrorMessage("Failed to toggle extension. Please try again.")}catch(e){console.error("Error toggling extension:",e),this.showErrorMessage("An error occurred while toggling the extension. Please try again.")}}updateRulesDisplay(){try{let e=this.state.rules.filter(i=>i.isDefault),t=this.state.rules.filter(i=>!i.isDefault),s=document.querySelector(".panel-card.default-panel .panel-count");s&&(s.textContent=e.filter(i=>i.enabled!==!1).length);let a=document.querySelector(".panel-card.custom-panel .panel-count");if(a&&(a.textContent=t.filter(i=>i.enabled!==!1).length),this.state.showDefaultRulesPanel){let i=this.state.activeCategory||"all",n=this._filterRules(i==="all"?e:e.filter(c=>c.category===i));document.querySelectorAll('.rules-panel-overlay[data-panel="default"] .category-tab').forEach(c=>c.classList.toggle("active",c.getAttribute("data-category")===i));let o=document.querySelector('.rules-panel-overlay[data-panel="default"] .rules-list-panel');o&&(n.length>0?o.innerHTML=n.map(c=>this.getCompactRuleItem(c)).join(""):o.innerHTML='<div class="empty-state-compact"><span class="empty-text">No rules in this category</span></div>')}this.state.showCustomRulesPanel&&this.renderCustomPanel()}catch(e){console.error("Error updating rules display:",e)}}renderCustomPanel(){let e=this._filterRules(this.state.rules.filter(s=>!s.isDefault)),t=document.querySelector('.rules-panel-overlay[data-panel="custom"] .panel-content');if(t)if(e.length>0){let s={},a=[];for(let r of e){let o=(r.group||"").trim();o&&(s[o]||(s[o]=[],a.push(o)),s[o].push(r))}let n=e.filter(r=>!(r.group||"").trim()).map(r=>this.getRuleItem(r)).join("");for(let r of a){let o=s[r],c=o.every(d=>d.enabled!==!1);n+=`
					<div class="rule-group-header">
						<span class="rule-group-title">${this.escapeHtml(r)} (${o.length})</span>
						<button class="btn btn-secondary btn-xs btn-toggle-group" data-group="${this.escapeHtml(r)}" data-enabled="${c?"1":"0"}">${c?"Disable all":"Enable all"}</button>
					</div>
				`+o.map(d=>this.getRuleItem(d)).join("")}t.innerHTML=`<div class="rules-list-panel">${n}</div>`}else t.innerHTML=`
				<div class="empty-state">
					<div class="empty-state-icon">\u{1F4DD}</div>
					<div class="empty-state-text">No custom rules configured</div>
					<button class="btn btn-primary btn-add-rule">Create your first rule</button>
				</div>
			`}async toggleGroup(e,t){let s=await this.sendMessage({action:"toggleGroup",group:e,enabled:t});if(s&&s.success){this.state.rules=this.state.rules.map(i=>!i.isDefault&&(i.group||"").trim()===e?{...i,enabled:t}:i),this.updateRulesDisplay(),this.state.showCustomRulesPanel&&this.renderCustomPanel();let a=typeof s.success=="number"?s.success:"";this.showSuccessMessage((t?"Enabled ":"Disabled ")+a+(a?" rule(s)":"")+' in group "'+e+'"')}else this.showErrorMessage("Failed to toggle group.")}updateStatusDisplay(){try{let e=document.querySelector(".status-indicator");if(e){let s=e.querySelector(".status-dot"),a=e.querySelector(".status-text");s&&(this.state.isEnabled?s.classList.add("active"):s.classList.remove("active")),a&&(a.textContent=this.state.isEnabled?"Active":"Inactive")}let t=document.querySelectorAll(".stat-value");t.length>=6&&(t[0].textContent=this.state.stats.modifiedRequests||0,t[1].textContent=this.state.stats.urlModifications||0,t[2].textContent=this.state.stats.postModifications||0,t[3].textContent=this.state.stats.responseModifications||0,t[4].textContent=this.state.stats.blockedRequests||0,t[5].textContent=this.state.stats.headerModifications||0)}catch(e){console.error("Error updating status display:",e)}}updateActivityDisplay(){try{let e=document.querySelector(".activity-log-list");if(!e)return;let t=this.state.activityLog||[];t.length>0?e.innerHTML=t.map(a=>this.getActivityEntry(a)).join(""):e.innerHTML=this.getActivityEmptyState();let s=document.querySelector(".activity-count");s&&(s.textContent=t.length+" entries")}catch(e){console.error("Error updating activity display:",e)}}async refreshDataAndUpdateDisplay(){try{let e=await this.sendMessage({action:"getStatus"});if(e){let t=JSON.stringify(this.state.stats)!==JSON.stringify(e.stats),s=JSON.stringify(this.state.ruleStats||{})!==JSON.stringify(e.ruleStats||{}),a=JSON.stringify(this.state.rules)!==JSON.stringify(e.rules),i=e.activityLog||[],n=this.state.activityLog.length!==i.length||this.state.activityLog.length>0&&JSON.stringify(this.state.activityLog)!==JSON.stringify(i),r=this.state.isEnabled!==e.isEnabled,o=this.state.defaultRulesEnabled!==e.hasDefaultRules;this.state.isEnabled=e.isEnabled,this.state.rules=e.rules||[],this.state.stats=e.stats||this.state.stats,this.state.activityLog=i,this.state.ruleStats=e.ruleStats||{},this.state.presets=e.presets||[],this.state.defaultRulesEnabled=e.hasDefaultRules||!1,this.state.categories=e.categories||[],this.state.version=e.version||null,(t||s||a||n||r||o)&&(this.updateStatusDisplay(),this.updateRulesDisplay(),n&&this.updateActivityDisplay())}}catch{}}getDefaultNewRule(){return{title:"",findReplacePairs:[{find:"",replace:"",useRegex:!1,targetType:"all"}],targetType:"findReplace",description:"",urlMatch:"",category:"",jsonFields:[],headerRules:[],mockStatus:200,mockBody:"",mockContentType:"application/json",delayMin:1e3,delayMax:1e3,injectCode:"",injectTiming:"document_start",urlParams:[],group:""}}showAddRuleModal(){if(this.state.showAddRule=!0,this.state.editingRule=null,this.newRule=this.getDefaultNewRule(),this._newRuleSnapshot=JSON.stringify(this.newRule),!document.querySelector(".modal-overlay")){let t=this.getModal();document.body.insertAdjacentHTML("beforeend",t),requestAnimationFrame(()=>{let s=document.querySelector(".modal-overlay");s&&s.classList.add("show")})}}editRule(e){let t=this.state.rules.find(i=>i.id===e);if(!t||t._protected)return;this.state.showAddRule=!0,this.state.editingRule=e;let s=t.targetType==="block"||t.targetType==="headers"||t.targetType==="jsonBody"||t.targetType==="mock"||t.targetType==="delay"||t.targetType==="inject"?t.targetType:"findReplace",a=[];Array.isArray(t.findReplacePairs)&&t.findReplacePairs.length>0?a=t.findReplacePairs.map(i=>({...i,targetType:i.targetType||s==="findReplace"&&t.targetType||"all"})):a=[{find:"",replace:"",useRegex:!1,targetType:"all"}],this.newRule={id:t.id,title:t.title||"",findReplacePairs:a,targetType:s,description:t.description||"",urlMatch:t.urlMatch||"",enabled:t.enabled!==!1,category:t.category||"",jsonFields:Array.isArray(t.jsonFields)?t.jsonFields.map(i=>({...i})):[],headerRules:Array.isArray(t.headerRules)?t.headerRules.map(i=>({...i})):[],urlParams:Array.isArray(t.urlParams)?t.urlParams.map(i=>({...i})):[],group:t.group||"",mockStatus:t.mockStatus!==void 0?t.mockStatus:200,mockBody:t.mockBody||"",mockContentType:t.mockContentType||"application/json",delayMin:t.delayMin!==void 0?t.delayMin:1e3,delayMax:t.delayMax!==void 0?t.delayMax:1e3,injectCode:t.injectCode||"",injectTiming:t.injectTiming||"document_start"},this._newRuleSnapshot=JSON.stringify(this.newRule),this.refreshModal()}async saveRule(){try{let t=this.newRule.targetType||"findReplace",s=t==="findReplace";if(s){let l=this.newRule.findReplacePairs||[],p=l.some(h=>h&&h.find&&h.find.trim()),v=this.newRule.urlParams&&this.newRule.urlParams.some(h=>h.name&&h.name.trim());if(!p&&!v){this.showErrorMessage("At least one Find/Replace pair or URL parameter operation is required.");return}for(let h=0;h<l.length;h++){let w=l[h];if(!w.find||!w.find.trim()){this.showErrorMessage(`Find text is required for pair ${h+1}.`);return}}}if((t==="block"||t==="mock")&&(!this.newRule.urlMatch||!this.newRule.urlMatch.trim())){this.showErrorMessage("URL match pattern is required for block and mock rules.");return}if(t==="inject"&&(!this.newRule.injectCode||!this.newRule.injectCode.trim())){this.showErrorMessage("JavaScript code is required for script injection rules.");return}let a=this.newRule.jsonFields&&this.newRule.jsonFields.length>0,i=this.newRule.findReplacePairs&&this.newRule.findReplacePairs.some(l=>l.find&&l.find.trim());if(t==="headers"&&(!this.newRule.headerRules||this.newRule.headerRules.length===0)){this.showErrorMessage("At least one header modification is required for header rules.");return}if(t==="jsonBody"&&!a&&!i){this.showErrorMessage("At least one JSON field modification is required for JSON body rules.");return}if(!this.newRule.title||!this.newRule.title.trim())if(s&&this.newRule.findReplacePairs&&this.newRule.findReplacePairs.length>0){var e=this.newRule.findReplacePairs[0];this.newRule.title=`Rule for "${e.find.substring(0,20)}${e.find.length>20?"...":""}"`}else this.newRule.title=t==="block"?"Block Rule":t==="mock"?"Mock Response":t==="delay"?"Delay Rule":t==="inject"?"Injected Script":"Untitled Rule";let n=this.normalizeUrlPatterns(this.newRule.urlMatch||""),r={title:this.newRule.title.trim(),description:(this.newRule.description||"").trim(),urlMatch:n,enabled:this.newRule.enabled!==!1,category:(this.newRule.category||"").trim(),group:(this.newRule.group||"").trim()};r.targetType=t==="findReplace"?"":t;let o=(this.newRule.findReplacePairs||[]).filter(l=>l&&l.find&&l.find.trim()).map(l=>({find:l.find.trim(),replace:l.replace||"",useRegex:!!l.useRegex,targetType:l.targetType||"all",urlMatch:l.urlMatch||""})),c=this._paramOpsToPairs(this.newRule.urlParams),d=o.slice();for(let l of c)d.some(p=>p.find===l.find)||d.push(l);d.length>0&&(r.findReplacePairs=d);let u=(this.newRule.urlParams||[]).filter(l=>l.name&&l.name.trim());u.length>0&&(r.urlParams=u);let m=(this.newRule.jsonFields||[]).filter(l=>l&&l.path&&l.path.trim()).map(l=>({action:l.action||"set",path:l.path.trim(),value:l.value||"",newName:l.newName||""}));m.length>0&&(r.jsonFields=m);let f=(this.newRule.headerRules||[]).filter(l=>l&&l.header&&l.header.trim()).map(l=>({action:l.action||"set",header:l.header.trim(),value:l.value||"",newName:l.newName||"",scope:l.scope==="response"?"response":"request"}));if(f.length>0&&(r.headerRules=f),t==="mock"&&(r.mockStatus=parseInt(this.newRule.mockStatus,10)||200,r.mockBody=this.newRule.mockBody||"",r.mockContentType=this.newRule.mockContentType||"application/json"),t==="delay"){let l=parseInt(this.newRule.delayMin,10),p=parseInt(this.newRule.delayMax,10);r.delayMin=isNaN(l)||l<0?1e3:l,r.delayMax=isNaN(p)||p<0?1e3:Math.max(l,p)}if(t==="inject"&&(r.injectCode=this.newRule.injectCode||"",r.injectTiming=this.newRule.injectTiming==="dom_ready"?"dom_ready":"document_start"),this.state.editingRule){r.id=this.newRule.id;let l=await this.sendMessage({action:"updateRule",ruleId:r.id,updates:r});if(l&&l.success){let p=this.state.rules.findIndex(v=>v.id===r.id);p!==-1&&(this.state.rules[p]={...this.state.rules[p],...r},delete this.state.rules[p].searchText,delete this.state.rules[p].replaceText,delete this.state.rules[p].useRegex)}else{this.showErrorMessage("Failed to update rule. Please try again.");return}}else{let l=await this.sendMessage({action:"addRule",rule:r});if(l&&l.success)this.state.rules.push(l.rule);else{this.showErrorMessage("Failed to add rule. Please try again.");return}}this.newRule=this.getDefaultNewRule(),this._newRuleSnapshot=JSON.stringify(this.newRule),this.hideModal();let g=this.state.rules.filter(l=>!l.isDefault),R=document.querySelector(".panel-card.custom-panel .panel-info p");R&&(R.textContent=`Your rules \u2022 ${g.filter(l=>l.enabled!==!1).length} active`),setTimeout(()=>{this.updateRulesDisplay(),this.state.showCustomRulesPanel&&this.renderCustomPanel()},250)}catch(t){console.error("Error saving rule:",t),this.showErrorMessage("An error occurred while saving the rule. Please try again.")}}async deleteRule(e){try{let t=this.state.rules.find(i=>i.id===e);if(!t){this.showErrorMessage("Rule not found.");return}if(t.isDefault||t._protected){this.showErrorMessage("Protected rules cannot be deleted. You can disable them instead.");return}if(!confirm(`Are you sure you want to delete the rule "${t.title||"Untitled Rule"}"?`))return;let s=t.title||"Untitled Rule",a=await this.sendMessage({action:"deleteRule",ruleId:e});if(a&&a.success){this.state.rules=this.state.rules.filter(n=>n.id!==e);let i=document.querySelector(".panel-card.custom-panel .panel-count");i&&(i.textContent=this.state.rules.filter(n=>!n.isDefault).length),this.updateRulesDisplay(),this.state.showCustomRulesPanel&&this.renderCustomPanel()}else this.showErrorMessage("Failed to delete rule. Please try again.")}catch(t){console.error("Error deleting rule:",t),this.showErrorMessage("An error occurred while deleting the rule. Please try again.")}}async moveRule(e,t){try{let s=await this.sendMessage({action:"moveRule",ruleId:e,direction:t});if(s&&s.success){let a=this.state.rules.findIndex(i=>i.id===e);if(a!==-1){let i=a+t;if(i>=0&&i<this.state.rules.length){let n=this.state.rules[a];this.state.rules[a]=this.state.rules[i],this.state.rules[i]=n}}this.updateRulesDisplay()}else this.showErrorMessage("Failed to move rule. Please try again.")}catch(s){console.error("Error moving rule:",s)}}async clearActivityLog(){try{await this.sendMessage({action:"clearActivityLog"}),this.state.activityLog=[];let e=document.querySelector(".activity-log-list");e&&(e.innerHTML=this.getActivityEmptyState());let t=document.querySelector(".activity-count");t&&(t.textContent="0 entries")}catch(e){console.error("Error clearing activity log:",e)}}async toggleRule(e){try{let t=this.state.rules.find(i=>i.id===e);if(!t){this.showErrorMessage("Rule not found.");return}let s=!t.enabled,a=await this.sendMessage({action:"updateRule",ruleId:e,updates:{enabled:s}});if(a&&a.success){t.enabled=s,this.updateRulesDisplay();let i=document.querySelector(`[data-rule-id="${e}"]`);i&&this.showSuccessAnimation(i)}else this.showErrorMessage("Failed to toggle rule. Please try again.")}catch(t){console.error("Error toggling rule:",t),this.showErrorMessage("An error occurred while toggling the rule. Please try again.")}}showDefaultRulesPanel(){this.state.showDefaultRulesPanel=!0,this.state.showCustomRulesPanel=!1;let e=document.querySelector(".rules-panel-overlay");e&&e.remove();let t=this.state.rules.filter(a=>a.isDefault),s=this.getDefaultRulesPanel(t);document.body.insertAdjacentHTML("beforeend",s),requestAnimationFrame(()=>{let a=document.querySelector(".rules-panel-overlay");a&&a.classList.add("show")})}showCustomRulesPanel(){this.state.showCustomRulesPanel=!0,this.state.showDefaultRulesPanel=!1;let e=document.querySelector(".rules-panel-overlay");e&&e.remove();let t=this.state.rules.filter(a=>!a.isDefault),s=this.getCustomRulesPanel(t);document.body.insertAdjacentHTML("beforeend",s),requestAnimationFrame(()=>{let a=document.querySelector(".rules-panel-overlay");a&&a.classList.add("show")})}closePanels(e){let t=document.querySelector(".rules-panel-overlay");t?(t.classList.add("closing"),setTimeout(()=>{t.classList.remove("show"),t.classList.remove("closing"),e==="default"?this.state.showDefaultRulesPanel=!1:e==="custom"&&(this.state.showCustomRulesPanel=!1),t.remove()},250)):e==="default"?this.state.showDefaultRulesPanel=!1:e==="custom"&&(this.state.showCustomRulesPanel=!1)}hideModal(){if(this._hasUnsavedChanges()&&!confirm("You have unsaved changes. Close anyway?"))return;this.state.showAddRule=!1,this.state.editingRule=null;let e=document.querySelector(".modal-overlay");e&&(e.classList.remove("show"),setTimeout(()=>{e.remove()},250))}_hasUnsavedChanges(){return!this.newRule||!this._newRuleSnapshot?!1:JSON.stringify(this.newRule)!==this._newRuleSnapshot}updateFormField(e,t){if(e.startsWith("pair-")){let s=e.split("-");if(s.length<3)return;let a=s[1],i=s[2],n=parseInt(a,10);if(isNaN(n)||n<0)return;this.newRule.findReplacePairs||(this.newRule.findReplacePairs=[]),this.newRule.findReplacePairs[n]||(this.newRule.findReplacePairs[n]={find:"",replace:"",useRegex:!1,targetType:"all"}),i==="useRegex"?this.newRule.findReplacePairs[n][i]=t===!0||t==="true":i==="find"||i==="replace"?this.newRule.findReplacePairs[n][i]=t||"":i==="targetType"?this.newRule.findReplacePairs[n][i]=t||"all":i==="urlMatch"&&(this.newRule.findReplacePairs[n][i]=t||"");return}if(e.startsWith("jsonField-")){let s=e.split("-");if(s.length<3)return;let a=parseInt(s[1],10),i=s.slice(2).join("-");if(isNaN(a)||a<0)return;this.newRule.jsonFields||(this.newRule.jsonFields=[]),this.newRule.jsonFields[a]||(this.newRule.jsonFields[a]={action:"set",path:"",value:"",newName:""}),this.newRule.jsonFields[a][i]=t||"";return}if(e.startsWith("urlParam-")){let s=e.split("-");if(s.length<3)return;let a=parseInt(s[1],10),i=s.slice(2).join("-");if(isNaN(a)||a<0)return;this.newRule.urlParams||(this.newRule.urlParams=[]),this.newRule.urlParams[a]||(this.newRule.urlParams[a]={action:"set",name:"",value:""}),this.newRule.urlParams[a][i]=t||"";return}if(e.startsWith("headerRule-")){let s=e.split("-");if(s.length<3)return;let a=parseInt(s[1],10),i=s.slice(2).join("-");if(isNaN(a)||a<0)return;this.newRule.headerRules||(this.newRule.headerRules=[]),this.newRule.headerRules[a]||(this.newRule.headerRules[a]={action:"set",header:"",value:"",newName:""}),this.newRule.headerRules[a][i]=t||"";return}this.newRule&&this.newRule.hasOwnProperty(e)&&(this.newRule[e]=t)}normalizeUrlPatterns(e){let t=[];return typeof e=="string"?t=e.split(`
`).map(s=>s.trim()).filter(s=>s.length>0):Array.isArray(e)&&(t=e.map(s=>String(s).trim()).filter(s=>s.length>0)),t.length===0?"":t.length===1?t[0]:t}addFindReplacePair(){try{this.newRule.findReplacePairs||(this.newRule.findReplacePairs=[]),this.newRule.findReplacePairs.push({find:"",replace:"",useRegex:!1,targetType:"all"}),this.updateModalPairs()}catch(e){console.error("Error adding find/replace pair:",e)}}removeFindReplacePair(e){try{if(!this.newRule.findReplacePairs||this.newRule.findReplacePairs.length<=1)return;e>=0&&e<this.newRule.findReplacePairs.length&&(this.newRule.findReplacePairs.splice(e,1),this.updateModalPairs())}catch(t){console.error("Error removing find/replace pair:",t)}}addJsonField(){this.newRule.jsonFields||(this.newRule.jsonFields=[]),this.newRule.jsonFields.push({action:"set",path:"",value:"",newName:""}),this.updateJsonFieldsList()}removeJsonField(e){this.newRule.jsonFields&&e>=0&&e<this.newRule.jsonFields.length&&(this.newRule.jsonFields.splice(e,1),this.updateJsonFieldsList())}addHeaderRule(){this.newRule.headerRules||(this.newRule.headerRules=[]),this.newRule.headerRules.push({action:"set",header:"",value:"",newName:"",scope:"request"}),this.updateHeaderRulesList()}removeHeaderRule(e){this.newRule.headerRules&&e>=0&&e<this.newRule.headerRules.length&&(this.newRule.headerRules.splice(e,1),this.updateHeaderRulesList())}addUrlParam(){this.newRule.urlParams||(this.newRule.urlParams=[]),this.newRule.urlParams.push({action:"set",name:"",value:""}),this.updateUrlParamsList()}removeUrlParam(e){this.newRule.urlParams&&e>=0&&e<this.newRule.urlParams.length&&(this.newRule.urlParams.splice(e,1),this.updateUrlParamsList())}_urlParamRowsHtml(){return(this.newRule.urlParams||[]).map((t,s)=>`
			<div class="url-param-row" data-param-idx="${s}">
				<select name="urlParam-${s}-action" class="form-input form-input-sm" style="width:auto;min-width:80px">
					<option value="set" ${t.action!=="delete"?"selected":""}>Set Value</option>
					<option value="delete" ${t.action==="delete"?"selected":""}>Delete</option>
				</select>
				<input type="text" name="urlParam-${s}-name" class="form-input form-input-sm" placeholder="Param name" value="${this.escapeHtml(t.name||"")}">
				${t.action!=="delete"?`<input type="text" name="urlParam-${s}-value" class="form-input form-input-sm" placeholder="New value (supports $rand{}, $var{}, $ts{}, $capture{})" value="${this.escapeHtml(t.value||"")}">`:""}
				<button type="button" class="btn btn-icon btn-secondary btn-sm btn-remove-url-param" data-param-idx="${s}" title="Remove">\u2715</button>
			</div>
		`).join("")}updateUrlParamsList(){let e=document.querySelector(".url-params-list");if(!e)return;(this.newRule.urlParams||[]).length===0?e.innerHTML='<div class="empty-hint">No URL parameter operations. Click "+ Add Param" to add one.</div>':e.innerHTML=this._urlParamRowsHtml()}_paramOpsToPairs(e){let t=[];for(let s of e||[]){let a=(s.name||"").trim();if(!a)continue;let i=a.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");s.action==="delete"?(t.push({find:"([?&]"+i+"=[^&]*)(?=&)",replace:"$1",useRegex:!0,targetType:"url"}),t.push({find:"[?&]"+i+"=[^&]*$",replace:"",useRegex:!0,targetType:"url"}),t.push({find:"&&",replace:"&",useRegex:!1,targetType:"url"})):t.push({find:"([?&]"+i+"=)[^&]*",replace:"$1"+(s.value||"").replace(/\$/g,"$$$$"),useRegex:!0,targetType:"url"})}return t}updateJsonFieldsList(){let e=document.querySelector(".json-fields-list");if(!e)return;let t=this.newRule.jsonFields||[];t.length===0?e.innerHTML='<div class="empty-hint">No JSON field modifications. Click "+ Add Field" to add one.</div>':e.innerHTML=t.map((s,a)=>`
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
					<select name="headerRule-${a}-scope" class="form-input form-input-sm" style="width:auto;min-width:100px">
						<option value="request" ${s.scope!=="response"?"selected":""}>Request</option>
						<option value="response" ${s.scope==="response"?"selected":""}>Response</option>
					</select>
					<input type="text" name="headerRule-${a}-header" class="form-input form-input-sm" placeholder="Header name" value="${this.escapeHtml(s.header||"")}">
					<input type="text" name="headerRule-${a}-value" class="form-input form-input-sm header-rule-value" placeholder="Value" value="${this.escapeHtml(s.value||"")}">
					${s.action==="rename"?`<input type="text" name="headerRule-${a}-newName" class="form-input form-input-sm" placeholder="New name" value="${this.escapeHtml(s.newName||"")}">`:""}
					<button type="button" class="btn btn-icon btn-secondary btn-sm btn-remove-header-rule" data-header-idx="${a}" title="Remove">\u2715</button>
				</div>
			`).join("")}updateModalPairs(){try{let e=document.querySelector(".find-replace-pairs-list");if(!e){console.warn("Pairs list element not found");return}if(!this.newRule.findReplacePairs||!Array.isArray(this.newRule.findReplacePairs)){console.warn("Invalid findReplacePairs data");return}let t=this.newRule.findReplacePairs.map((s,a)=>{let i={find:s?.find||"",replace:s?.replace||"",useRegex:!!s?.useRegex,targetType:s?.targetType||"all",urlMatch:s?.urlMatch||""};return`
					<div class="find-replace-pair">
						<label>Find (text or regex)</label>
						<textarea name="pair-${a}-find" class="form-input" rows="2" placeholder="Enter text or regex pattern to find">${this.escapeHtml(i.find)}</textarea>
						<label>Replace</label>
						<textarea name="pair-${a}-replace" class="form-input" rows="2" placeholder="Supports $rand{}, $var{}, $ts{}, $capture{}">${this.escapeHtml(i.replace)}</textarea>
						<label>Target</label>
						<select name="pair-${a}-targetType" class="form-input form-input-sm">${this._pairTargetOptions(i.targetType)}</select>
						<label>URL Match (optional \u2014 overrides the rule-level match for this pair)</label>
						<input type="text" name="pair-${a}-urlMatch" class="form-input form-input-sm" placeholder="e.g. api.example.com/*" value="${this.escapeHtml(i.urlMatch||"")}">
						<div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
							<label class="form-checkbox">
								<input type="checkbox" name="pair-${a}-useRegex" ${i.useRegex?"checked":""} />
								<span>USE REGEX</span>
							</label>
							${this.newRule.findReplacePairs.length>1?`<button type="button" class="btn btn-icon btn-secondary btn-remove-pair" data-pair-idx="${a}" title="Remove pair">\u274C</button>`:""}
						</div>
					</div>
				`}).join("");e.innerHTML=t}catch(e){console.error("Error updating modal pairs:",e)}}refreshModal(){let e=document.querySelector(".modal-overlay");e&&e.remove(),document.body.insertAdjacentHTML("beforeend",this.getModal()),requestAnimationFrame(()=>{let t=document.querySelector(".modal-overlay");t&&t.classList.add("show")})}async toggleDefaultRules(){let e=document.querySelector(".default-rules-toggle");e&&(e.style.pointerEvents="none",e.style.opacity="0.7");try{if(this.state.defaultRulesEnabled){let t=await this.sendMessage({action:"clearDefaults"});t&&t.success&&(this.state.defaultRulesEnabled=!1,e&&e.classList.remove("active"),this.state.rules=this.state.rules.filter(s=>!s.isDefault),this.updateRulesDisplay())}else{let t=await this.sendMessage({action:"loadDefaults"});t&&t.success&&(this.state.defaultRulesEnabled=!0,e&&e.classList.add("active"),await this.refreshDataAndUpdateDisplay())}}finally{e&&(e.style.pointerEvents="",e.style.opacity="")}}async undo(){let e=await this.sendMessage({action:"undo"});e&&e.success?(this.showSuccessMessage("Last change undone"),await this.refreshData()):this.showErrorMessage("Nothing to undo.")}async clearStats(){let e=await this.sendMessage({action:"clearStats"});e&&e.success&&await this.refreshDataAndUpdateDisplay()}async exportCustomRules(){try{let e=await this.sendMessage({action:"exportRules"});if(e&&e.success&&e.data){let t=e.data;if((t.rules?t.rules.length:0)===0){this.showErrorMessage("No custom rules to export");return}let a=JSON.stringify(t,null,2),i=new Blob([a],{type:"application/json"}),n=URL.createObjectURL(i),r=document.createElement("a");r.href=n;let o=new Date().toISOString().split("T")[0];r.download=`request-interceptor-rules-${o}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),setTimeout(()=>URL.revokeObjectURL(n),1e3)}else this.showErrorMessage("Failed to export rules")}catch{this.showErrorMessage("Failed to export rules")}}showRuleTester(){let e=document.querySelector(".tester-panel-overlay");if(e){e.remove();return}document.body.insertAdjacentHTML("beforeend",this.getTesterPanel()),requestAnimationFrame(()=>{let t=document.querySelector(".tester-panel-overlay");t&&t.classList.add("show")})}getTesterPanel(){return`
      <div class="tester-panel-overlay">
        <div class="rules-panel">
          <div class="panel-header-full">
            <h3>\u{1F9EA} Rule Tester</h3>
            <button class="btn btn-icon btn-secondary btn-close-tester">\u2715</button>
          </div>
          <div class="panel-content">
            <input type="text" id="tester-url" class="form-input" placeholder="URL (e.g. https://api.example.com/pay?x=1)">
            <select id="tester-type" class="form-input form-input-sm" style="margin-top:8px; max-width:240px">
              <option value="url">URL</option>
              <option value="post">POST Body</option>
              <option value="response">Response Body</option>
              <option value="jsonBody">JSON Body (Fields)</option>
            </select>
            <textarea id="tester-body" class="form-input" rows="6" style="margin-top:8px" placeholder="Body text to run the rules against (leave empty for URL tests)"></textarea>
            <button class="btn btn-primary btn-sm btn-run-tester" style="margin-top:8px">Run</button>
            <pre id="tester-result" style="margin-top:10px; background:#111; color:#9f9; padding:10px; border-radius:6px; font-size:12px; white-space:pre-wrap; word-break:break-all; max-height:300px; overflow:auto;">Result appears here</pre>
          </div>
        </div>
      </div>
    `}async _ensureTestEngine(){return window.__RI__&&window.__RI__.modify?window.__RI__:new Promise((e,t)=>{let s=document.createElement("iframe");s.style.display="none",s.src=chrome.runtime.getURL("test-engine.html"),s.onload=()=>{try{let a=s.contentWindow.__RI__;a&&a.modify?(window.__RI__=a,e(a)):t(new Error("Engine not loaded"))}catch(a){t(a)}},s.onerror=()=>t(new Error("Engine load failed")),document.body.appendChild(s)})}async runRuleTester(){let e=(document.getElementById("tester-url")||{}).value||"",t=(document.getElementById("tester-type")||{}).value||"url",s=(document.getElementById("tester-body")||{}).value||"",a=document.getElementById("tester-result");if(!e){this.showErrorMessage("URL is required for testing.");return}try{let i=await this._ensureTestEngine();i.config.enabled=!0,i.config.rules=JSON.parse(JSON.stringify(this.state.rules)),i.config.removals=[],i._sessionVars={},i._captures={};let n=t==="url"&&!s?e:s,r=t==="jsonBody"?i.modifyJsonBody(n,e):i.modify(n,t,e),o=i._shouldBlock(e),c=i._getMockRule(e),d=i._getDelayRule(e),u=[];o&&u.push("\u{1F6AB} BLOCKED \u2014 the request would be dropped"),c&&u.push("\u{1F3AD} MOCKED \u2014 fake response, status "+(c.mockStatus||200)),d&&u.push("\u23F1 DELAYED \u2014 "+i.getDelayMs(d)+" ms (this sample)"),r.modified?(u.push("\u2705 Modified by: "+(r.appliedRules||[]).join(", ")),u.push(""),u.push(String(r.result))):(u.push("\u274C No rule modified this input"),u.push(""),u.push(String(n))),a.textContent=u.join(`
`)}catch(i){a.textContent="Error: "+i.message}}async showCookiesPanel(){try{let e=await chrome.tabs.query({active:!0,currentWindow:!0}),t=e&&e[0]&&e[0].url?e[0].url:"";if(!t||!/^https?:\/\//i.test(t)){this.showErrorMessage("Cookies are only available for http(s) tabs.");return}this.state.cookiesUrl=t;let s=await this.sendMessage({action:"getCookies",url:t});this.state.cookies=s&&s.cookies||[];let a=document.querySelector(".cookies-panel-overlay");a&&a.remove(),document.body.insertAdjacentHTML("beforeend",this.getCookiesPanel()),requestAnimationFrame(()=>{let i=document.querySelector(".cookies-panel-overlay");i&&i.classList.add("show")})}catch{this.showErrorMessage("Failed to load cookies.")}}closeCookiesPanel(){let e=document.querySelector(".cookies-panel-overlay");e&&e.remove(),this.state.showCookiesPanel=!1}getCookiesPanel(){let e=this.state.cookies||[];return`
      <div class="cookies-panel-overlay">
        <div class="rules-panel">
          <div class="panel-header-full">
            <h3>\u{1F36A} Cookies \u2014 ${this.escapeHtml(this.state.cookiesUrl)}</h3>
            <button class="btn btn-icon btn-secondary btn-close-cookies">\u2715</button>
          </div>
          <div class="panel-content">
            <div style="display:flex; gap:8px; margin-bottom:10px;">
              <input type="text" id="cookie-new-name" class="form-input form-input-sm" placeholder="Name">
              <input type="text" id="cookie-new-value" class="form-input form-input-sm" style="flex:1" placeholder="Value">
              <button class="btn btn-primary btn-sm btn-add-cookie">Add</button>
            </div>
            ${e.length>0?`
            <div class="rules-list-panel">
              ${e.map(t=>`
                <div class="rule-item rule-item-custom">
                  <div class="rule-header">
                    <div class="rule-info">
                      <span class="rule-title" style="font-size:13px">${this.escapeHtml(t.name)}${t.secure?" \u{1F512}":""}${t.session?" (session)":""}</span>
                      <div class="rule-meta"><span class="rule-desc">${this.escapeHtml(t.value)}</span></div>
                    </div>
                    <div class="rule-actions">
                      <button class="btn btn-icon btn-secondary btn-cookie-delete" data-name="${this.escapeHtml(t.name)}" title="Delete">\u2716</button>
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>
            `:'<div class="empty-state"><div class="empty-state-icon">\u{1F36A}</div><div class="empty-state-text">No cookies for this domain</div></div>'}
          </div>
        </div>
      </div>
    `}async refreshCookiesList(){let e=await this.sendMessage({action:"getCookies",url:this.state.cookiesUrl});this.state.cookies=e&&e.cookies||[];let t=document.querySelector(".cookies-panel-overlay");t&&(t.outerHTML=this.getCookiesPanel(),requestAnimationFrame(()=>{let s=document.querySelector(".cookies-panel-overlay");s&&s.classList.add("show")}))}async addCookie(){let e=document.getElementById("cookie-new-name"),t=document.getElementById("cookie-new-value"),s=e?e.value.trim():"",a=t?t.value:"";if(!s){this.showErrorMessage("Cookie name required.");return}let i=await this.sendMessage({action:"setCookie",url:this.state.cookiesUrl,name:s,value:a});i&&i.success?await this.refreshCookiesList():this.showErrorMessage("Failed to set cookie.")}async deleteCookie(e){let t=await this.sendMessage({action:"deleteCookie",url:this.state.cookiesUrl,name:e});t&&t.success?await this.refreshCookiesList():this.showErrorMessage("Failed to delete cookie.")}async savePreset(){let e=prompt("Preset name:");if(!e||!e.trim())return;let t=e.trim();if((this.state.presets||[]).indexOf(t)!==-1&&!confirm(`Preset "${t}" already exists. Overwrite it?`))return;let s=await this.sendMessage({action:"savePreset",name:t});s&&s.success?(this.showSuccessMessage("Preset saved: "+t),await this.refreshDataAndUpdateDisplay(),this.render()):this.showErrorMessage("Failed to save preset.")}async loadPreset(){let e=document.getElementById("preset-select"),t=e?e.value:"";if(!t){this.showErrorMessage("No preset selected.");return}if(!confirm(`Replace your current custom rules with preset "${t}"?`))return;let s=await this.sendMessage({action:"loadPreset",name:t});s&&s.success?(this.showSuccessMessage("Preset loaded: "+t),await this.refreshData()):this.showErrorMessage("Failed to load preset.")}async deletePreset(){let e=document.getElementById("preset-select"),t=e?e.value:"";if(!t||!confirm(`Delete preset "${t}"?`))return;let s=await this.sendMessage({action:"deletePreset",name:t});s&&s.success&&(this.showSuccessMessage("Preset deleted: "+t),await this.refreshDataAndUpdateDisplay(),this.render())}async importCustomRules(e){try{let t=e.files[0];if(!t)return;let s=await t.text(),a;try{a=JSON.parse(s)}catch{this.showErrorMessage("Invalid JSON file"),e.value="";return}let i=await this.sendMessage({action:"importRules",data:a});if(i&&i.success){await this.refreshData();let n=`Imported ${i.imported||0} custom rule(s)`;i.duplicates&&(n+=` \u2014 ${i.duplicates} id collision(s) regenerated`),i.skipped&&(n+=` \u2014 ${i.skipped} skipped`),this.showSuccessMessage(n)}else i&&i.skipped!==void 0?this.showErrorMessage(`Nothing imported \u2014 ${i.skipped} rule(s) skipped (invalid or protected duplicates).`):this.showErrorMessage("Failed to import rules. Check file format.");e.value=""}catch(t){console.error("Error importing rules:",t),this.showErrorMessage("Failed to import rules")}}render(){let e=document.getElementById("root");this.state.loading?e.innerHTML=this.getLoadingSkeleton():e.innerHTML=this.getHTML()}getLoadingSkeleton(){return`
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
    `}_filterRules(e){let t=(this.state.ruleSearch||"").trim().toLowerCase();return t?e.filter(s=>(s.title||"").toLowerCase().indexOf(t)!==-1||(s.description||"").toLowerCase().indexOf(t)!==-1||(s.group||"").toLowerCase().indexOf(t)!==-1||(Array.isArray(s.urlMatch)?s.urlMatch.join(" "):s.urlMatch||"").toLowerCase().indexOf(t)!==-1?!0:(s.findReplacePairs||[]).some(i=>(i.find||"").toLowerCase().indexOf(t)!==-1||(i.replace||"").toLowerCase().indexOf(t)!==-1)):e}getRulesSection(){let e=this.state.rules.filter(s=>s.isDefault),t=this.state.rules.filter(s=>!s.isDefault);return`
      <div class="rules-section">
        <div class="section-header">
          <div class="section-title">Rules Management</div>
          <input type="text" id="rule-search" class="form-input form-input-sm" style="max-width:220px" placeholder="Search rules..." value="${this.escapeHtml(this.state.ruleSearch||"")}">
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
    `}getDefaultRulesPanel(e){let t=this.state.categories||[],s=this.state.activeCategory||"all",a=`<button class="category-tab ${s==="all"?"active":""}" data-category="all" style="--tab-color:#888">All (${e.length})</button>`;for(let n of t){let r=e.filter(o=>o.category===n.id).length;r>0&&(a+=`<button class="category-tab ${s===n.id?"active":""}" data-category="${this.escapeHtml(n.id)}" style="--tab-color:${this.escapeHtml(n.color||"#888")}">${this.escapeHtml(n.name)} (${r})</button>`)}let i=this._filterRules(s==="all"?e:e.filter(n=>n.category===s));return`
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
    `}getCustomRulesPanel(e){let t=this._filterRules(e);return`
      <div class="rules-panel-overlay" data-panel="custom">
        <div class="rules-panel">
          <div class="panel-header-full">
            <h3>Your Rules</h3>
            <button class="btn btn-icon btn-secondary btn-close-panel" data-panel="custom">\u2715</button>
          </div>
          <div class="panel-content">
            ${t.length>0?`
            <div class="rules-list-panel">
              ${t.map(s=>this.getRuleItem(s)).join("")}
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
    `}_getTargetTypeBadge(e){return{all:"ALL",post:"POST",url:"URL",response:"RESP",both:"BOTH",block:"BLOCK",headers:"HDR",jsonBody:"JSON",base64:"B64",mock:"MOCK",delay:"DELAY",inject:"INJECT"}[e]||""}_pairTargetOptions(e){return[["all","All (URL + POST + Response)"],["url","URL"],["post","POST Body"],["response","Response Body"],["both","Both (URL + POST)"],["jsonBody","JSON Body (Fields)"],["base64","Base64 Body"]].map(([s,a])=>`<option value="${s}" ${e===s?"selected":""}>${a}</option>`).join("")}_ruleTypeBadges(e){let t=[],s=new Set((e.findReplacePairs||[]).map(a=>a.targetType||e.targetType||"all"));if(s.forEach(a=>{let i=this._getTargetTypeBadge(a);i&&t.indexOf(i)===-1&&t.push(i)}),s.size===0){let a=this._getTargetTypeBadge(e.targetType);a&&t.push(a)}return t}getCompactRuleItem(e){if(e._protected){let r="";return e.description&&(r=`<span class="rule-compact-description">${this.escapeHtml(e.description)}</span>`),`
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
    `}let t=this._ruleTypeBadges(e);e.findReplacePairs&&e.findReplacePairs.length>0&&e.findReplacePairs.some(r=>r.useRegex)&&t.push("REGEX");let a=(this.state.ruleStats||{})[e.title||"Untitled Rule"];a&&t.push("\u26A1"+a.hits),e.urlMatch&&(Array.isArray(e.urlMatch)?e.urlMatch.length>0:e.urlMatch.trim()!=="")&&t.push("MATCH");let n=t.join(" \u2022 ");return`
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
    `}getRuleItem(e){let t=e.title||"Untitled Rule",s=(this.state.ruleStats||{})[t],a=e.isDefault,i=e._protected,n="",r="",o=!1,c=0;e.findReplacePairs&&e.findReplacePairs.length>0&&(n=e.findReplacePairs[0].find,r=e.findReplacePairs[0].replace,o=e.findReplacePairs.some(g=>g.useRegex),c=e.findReplacePairs.length);let d=this._ruleTypeBadges(e);o&&d.push("REGEX"),e.urlMatch&&(Array.isArray(e.urlMatch)?e.urlMatch.length>0:e.urlMatch.trim()!=="")&&d.push("MATCH");let u=d.join(" \u2022 "),m=Array.isArray(e.urlMatch)?e.urlMatch.join(", "):e.urlMatch||"",f=c>1?` +${c-1} more`:"";return`
      <div class="rule-item ${a?"rule-item-default":"rule-item-custom"} ${e.enabled?"enabled":"disabled"}">
        <div class="rule-header">
          <div class="rule-toggle-small ${e.enabled?"active":""}" 
               data-rule-id="${e.id}" 
               title="${e.enabled?"Disable":"Enable"} rule">
            <div class="rule-toggle-small-thumb"></div>
          </div>
          <div class="rule-info">
            <div class="rule-title-row">
              <span class="rule-title">${i?"\u{1F512} ":""}${this.escapeHtml(t)}</span>
              <div class="rule-actions">
                ${!a&&!i?`
                <button class="btn btn-icon btn-xs btn-move-up" data-rule-id="${e.id}" title="Move up">\u25B2</button>
                <button class="btn btn-icon btn-xs btn-move-down" data-rule-id="${e.id}" title="Move down">\u25BC</button>
                `:""}
                ${i?"":`
                <button class="btn btn-icon btn-secondary btn-edit-rule" data-rule-id="${e.id}" title="Edit">\u270F\uFE0F</button>
                <button class="btn btn-icon btn-secondary btn-delete-rule" data-rule-id="${e.id}" title="Delete">\u2716</button>
                `}
              </div>
            </div>
            <div class="rule-meta">
              ${s?`<span class="rule-hits" title="${s.lastHit?"Last hit "+this.formatTimeAgo(s.lastHit):""}">\u26A1 ${s.hits} hits</span>`:""}
              <span class="rule-type-badge">${i?"\u{1F512} PROTECTED":u}</span>
              ${i?'<span class="rule-desc">Rule body is encrypted \u2014 cannot be viewed or exported</span>':""}
              ${e.description?`<span class="rule-desc">${this.escapeHtml(e.description)}</span>`:""}
            </div>
          </div>
        </div>
        ${i?"":`
        ${m?`<div class="rule-url-line"><span>\u{1F517}</span><code>${this.escapeHtml(m)}</code></div>`:""}
        <div class="rule-patterns">
          <div class="pattern-row">
            <span class="pattern-label">FIND</span>
            <code>${this.escapeHtml(n)}</code>
          </div>
          ${r?`
          <div class="pattern-row">
            <span class="pattern-label">REPL</span>
            <code>${this.escapeHtml(r)}</code>
          </div>
          `:""}
          ${f?`<div class="pattern-more">${f}</div>`:""}
        </div>
        `}
      </div>
    `}getActionsSection(){return`
      <div class="section-header mt-4">
        <div class="section-title">Quick Actions</div>
      </div>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button class="btn btn-secondary btn-sm btn-undo">\u21A9 Undo</button>
        <button class="btn btn-secondary btn-sm btn-clear-stats">Clear Statistics</button>
        <button class="btn btn-secondary btn-sm btn-clear-activity">Clear Activity</button>
        <button class="btn btn-secondary btn-sm btn-export-rules">Export Custom Rules</button>
        <button class="btn btn-secondary btn-sm btn-import-rules">Import Custom Rules</button>
        <button class="btn btn-secondary btn-sm btn-view-cookies">\u{1F36A} Cookies</button>
        <button class="btn btn-secondary btn-sm btn-test-rules">\u{1F9EA} Test</button>
        <input type="file" id="import-file-input" accept=".json" style="display:none">
      </div>
      <div style="display:flex; gap:8px; align-items:center; margin-top:10px;">
        <span style="font-size:12px; color:var(--text-muted);">Presets:</span>
        <select id="preset-select" class="form-input form-input-sm" style="flex:1; max-width:220px">
          <option value="">\u2014 select preset \u2014</option>
          ${(this.state.presets||[]).map(e=>`<option value="${this.escapeHtml(e)}">${this.escapeHtml(e)}</option>`).join("")}
        </select>
        <button class="btn btn-secondary btn-sm btn-load-preset">Load</button>
        <button class="btn btn-secondary btn-sm btn-save-preset">Save As\u2026</button>
        <button class="btn btn-secondary btn-sm btn-delete-preset">Delete</button>
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
        <textarea name="pair-${s}-replace" class="form-input" rows="2" placeholder="Supports $rand{min,max}, $var{name,min,max}, $ts{}, $capture{name} (leave empty to remove)">${this.escapeHtml(t.replace)}</textarea>
        <label>Target</label>
        <select name="pair-${s}-targetType" class="form-input form-input-sm">${this._pairTargetOptions(t.targetType||"all")}</select>
        <label>URL Match (optional \u2014 overrides the rule-level match for this pair)</label>
        <input type="text" name="pair-${s}-urlMatch" class="form-input form-input-sm" placeholder="e.g. api.example.com/*" value="${this.escapeHtml(t.urlMatch||"")}">
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
                <label class="form-label">Rule Type</label>
                <select name="targetType" class="form-input" id="target-type-select">
                  <option value="findReplace" ${this.newRule.targetType==="findReplace"?"selected":""}>Find & Replace</option>
                  <option value="jsonBody" ${this.newRule.targetType==="jsonBody"?"selected":""}>JSON Body (Fields)</option>
                  <option value="headers" ${this.newRule.targetType==="headers"?"selected":""}>Headers</option>
                  <option value="block" ${this.newRule.targetType==="block"?"selected":""}>Block Request</option>
                  <option value="mock" ${this.newRule.targetType==="mock"?"selected":""}>Mock Response</option>
                  <option value="delay" ${this.newRule.targetType==="delay"?"selected":""}>Delay (Throttle)</option>
                  <option value="inject" ${this.newRule.targetType==="inject"?"selected":""}>Script Injection</option>
                </select>
              </div>
              <div class="form-group" style="flex:1;">
                <label class="form-label">Category</label>
                <select name="category" class="form-input">
                  <option value="">None</option>
                  ${this.state.categories.map(t=>`<option value="${this.escapeHtml(t.id)}" ${(this.newRule.category||"")===t.id?"selected":""}>${this.escapeHtml(t.name)}</option>`).join("")}
                </select>
              </div>
              <div class="form-group" style="flex:1;">
                <label class="form-label">Group</label>
                <input type="text" name="group" class="form-input" placeholder="e.g. testing" value="${this.escapeHtml(this.newRule.group||"")}">
              </div>
            </div>
            ${this.newRule.targetType==="findReplace"?`
            <div class="form-group find-replace-group">
              <label class="form-label">Find & Replace Pairs</label>
              <div class="find-replace-pairs-list">${e}</div>
              <button type="button" class="btn btn-secondary btn-sm btn-add-pair mt-2">+ Add Another Pair</button>
            </div>
            `:""}
            ${this.newRule.targetType==="jsonBody"?this.getJsonFieldsEditor():""}
            ${this.newRule.targetType==="inject"?`
            <div class="form-group inject-group">
              <label class="form-label">JavaScript to Inject</label>
              <textarea name="injectCode" class="form-input" rows="8" placeholder="Runs in the page context \u2014 e.g. document.title = 'hi'">${this.escapeHtml(this.newRule.injectCode||"")}</textarea>
              <label class="form-label">Timing</label>
              <select name="injectTiming" class="form-input form-input-sm">
                <option value="document_start" ${this.newRule.injectTiming!=="dom_ready"?"selected":""}>As early as possible</option>
                <option value="dom_ready" ${this.newRule.injectTiming==="dom_ready"?"selected":""}>After DOM is ready</option>
              </select>
            </div>
            `:""}
            ${this.newRule.targetType==="delay"?`
            <div class="form-group delay-group">
              <label class="form-label">Delay (milliseconds)</label>
              <div style="display:flex; gap:12px;">
                <input type="number" name="delayMin" class="form-input form-input-sm" placeholder="Min ms" value="${this.escapeHtml(String(this.newRule.delayMin!==void 0?this.newRule.delayMin:1e3))}">
                <input type="number" name="delayMax" class="form-input form-input-sm" placeholder="Max ms (same as min = fixed)" value="${this.escapeHtml(String(this.newRule.delayMax!==void 0?this.newRule.delayMax:1e3))}">
              </div>
              <small style="font-size:11px;color:var(--text-muted)">Fixed latency = same min/max. Random range = different values. Leave URL Match empty to delay everything.</small>
            </div>
            `:""}
            ${this.newRule.targetType==="mock"?`
            <div class="form-group mock-group">
              <label class="form-label">Mock Response</label>
              <div style="display:flex; gap:12px;">
                <input type="number" name="mockStatus" class="form-input form-input-sm" style="max-width:110px" placeholder="Status" value="${this.escapeHtml(String(this.newRule.mockStatus!==void 0?this.newRule.mockStatus:200))}">
                <input type="text" name="mockContentType" class="form-input form-input-sm" style="flex:1" placeholder="Content-Type (e.g. application/json)" value="${this.escapeHtml(this.newRule.mockContentType||"")}">
              </div>
              <textarea name="mockBody" class="form-input" rows="6" placeholder="Response body (supports $rand{}, $var{}, $ts{}, $capture{})">${this.escapeHtml(this.newRule.mockBody||"")}</textarea>
            </div>
            `:""}
            ${this.newRule.targetType==="headers"||this.newRule.targetType==="findReplace"||this.newRule.targetType==="mock"?this.getHeaderRulesEditor():""}
            ${this.newRule.targetType==="findReplace"?`
            <div class="form-group url-params-group">
              <label class="form-label">URL Parameters</label>
              <div class="url-params-list">${this.newRule.urlParams&&this.newRule.urlParams.length>0?this._urlParamRowsHtml():'<div class="empty-hint">No URL parameter operations. Click "+ Add Param" to add one.</div>'}</div>
              <button type="button" class="btn btn-secondary btn-sm btn-add-url-param mt-2">+ Add Param</button>
              <small style="font-size:11px;color:var(--text-muted)">Convenience editor compiled into URL pairs on save. "Set Value" replaces the value when the param exists.</small>
            </div>
            `:""}
            <div class="form-group">
              <label class="form-label">Description</label>
              <input type="text" name="description" class="form-input" value="${this.escapeHtml(this.newRule.description)}" placeholder="Brief description of what this rule does">
            </div>
            <div class="form-group">
              <label class="form-label">URL Match</label>
              <textarea name="urlMatch" class="form-input" rows="3" placeholder="URL pattern(s) with wildcard support (e.g., 'api.example.com/*')
Enter one pattern per line for multiple URLs">${this.escapeHtml(Array.isArray(this.newRule.urlMatch)?this.newRule.urlMatch.join(`
`):this.newRule.urlMatch||"")}</textarea>
              <small style="font-size: 11px; color: var(--text-muted); margin-top: 6px; display: block;">Leave empty to apply to all URLs. Enter one URL pattern per line to match multiple URLs. Supports wildcards (*). Individual pairs can override this with their own URL Match.</small>
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
				<select name="headerRule-${a}-scope" class="form-input form-input-sm" style="width:auto;min-width:100px">
					<option value="request" ${s.scope!=="response"?"selected":""}>Request</option>
					<option value="response" ${s.scope==="response"?"selected":""}>Response</option>
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
			`,s.textContent=e,t.querySelectorAll(".error-message").forEach(a=>a.remove()),t.insertBefore(s,t.firstChild),setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},5e3)}catch(t){console.error("Error displaying error message:",t),console.error("Extension error:",e)}}};document.addEventListener("DOMContentLoaded",()=>{let b=new y;window.addEventListener("beforeunload",()=>{b.cleanup()})});})();
