(()=>{var w=class{constructor(){try{this.state={isEnabled:!1,rules:[],loading:!0,version:null,versionError:null,stats:{modifiedRequests:0,urlModifications:0,postModifications:0,responseModifications:0,blockedRequests:0,headerModifications:0},activityLog:[],ruleStats:{},ruleSearch:"",showAddRule:!1,editingRule:null,defaultRulesEnabled:!0,showDefaultRulesPanel:!1,showCustomRulesPanel:!1,categories:[],activeCategory:"all"},this.newRule=this.getDefaultNewRule(),this._newRuleSnapshot=JSON.stringify(this.newRule),this.init()}catch(e){console.error("Error initializing RequestModifierPopup:",e)}}async init(){this.setupEventListeners(),this.render(),await this.refreshData(),this.startAutoRefresh()}cleanup(){this.stopAutoRefresh()}setupEventListeners(){document.addEventListener("click",e=>{let t=e.target;if((t.matches(".toggle-switch")||t.closest(".toggle-switch"))&&!t.matches(".default-rules-toggle")&&!t.closest(".default-rules-toggle")){e.preventDefault(),e.stopPropagation(),this.toggleEnabled();return}if(t.matches(".default-rules-toggle")||t.closest(".default-rules-toggle")){e.preventDefault(),e.stopPropagation(),this.toggleDefaultRules();return}if(t.matches(".rule-toggle-small")||t.closest(".rule-toggle-small")){e.preventDefault(),e.stopPropagation();let s=t.getAttribute("data-rule-id")||t.closest(".rule-toggle-small").getAttribute("data-rule-id");this.toggleRule(s);return}if(t.matches(".activity-url")){t.classList.toggle("expanded");return}if(t.matches(".btn-edit-rule")){this.editRule(t.getAttribute("data-rule-id"));return}if(t.matches(".btn-move-up")){this.moveRule(t.getAttribute("data-rule-id"),-1);return}if(t.matches(".btn-move-down")){this.moveRule(t.getAttribute("data-rule-id"),1);return}if(t.matches(".btn-delete-rule")){this.deleteRule(t.getAttribute("data-rule-id"));return}if(t.matches(".btn-duplicate-rule")){this.duplicateRule(t.getAttribute("data-rule-id"));return}if(t.matches(".btn-add-rule")){this.showAddRuleModal();return}if(t.matches(".btn-cancel")){this.hideModal();return}if(t.matches(".btn-clear-stats")){this.clearStats();return}if(t.matches(".btn-clear-activity")){this.clearActivityLog();return}if(t.matches(".btn-export-rules")){this.exportCustomRules();return}if(t.matches(".btn-import-rules")){document.getElementById("import-file-input").click();return}if(t.matches(".btn-view-defaults")){this.showDefaultRulesPanel();return}if(t.matches(".btn-view-customs")){this.showCustomRulesPanel();return}if(t.matches(".btn-close-panel")){this.closePanels(t.getAttribute("data-panel"));return}if(t.matches(".category-tab")){this.state.activeCategory=t.getAttribute("data-category"),this.updateRulesDisplay();return}if(t.matches(".btn-add-pair")){e.preventDefault(),this.addFindReplacePair();return}if(t.matches(".btn-remove-pair")){e.preventDefault(),this.removeFindReplacePair(parseInt(t.getAttribute("data-pair-idx"),10));return}if(t.matches(".btn-add-block")){e.preventDefault(),this.addBlock();return}if(t.matches(".btn-remove-block")){e.preventDefault(),this.removeBlock(parseInt(t.getAttribute("data-block-idx"),10));return}if(t.matches(".btn-move-block-up")){e.preventDefault(),this.moveBlock(parseInt(t.getAttribute("data-block-idx"),10),-1);return}if(t.matches(".btn-move-block-down")){e.preventDefault(),this.moveBlock(parseInt(t.getAttribute("data-block-idx"),10),1);return}if(t.matches(".btn-add-json-field")){e.preventDefault(),this.addJsonField();return}if(t.matches(".btn-remove-json-field")){e.preventDefault(),this.removeJsonField(parseInt(t.getAttribute("data-field-idx"),10));return}if(t.matches(".btn-add-header-rule")){e.preventDefault(),this.addHeaderRule();return}if(t.matches(".btn-remove-header-rule")){e.preventDefault(),this.removeHeaderRule(parseInt(t.getAttribute("data-header-idx"),10));return}if(t.matches(".btn-add-url-param")){e.preventDefault(),this.addUrlParam();return}if(t.matches(".btn-remove-url-param")){e.preventDefault(),this.removeUrlParam(parseInt(t.getAttribute("data-param-idx"),10));return}if(t.matches(".rules-panel-overlay")){let s=t.getAttribute("data-panel");s&&this.closePanels(s);return}if(t.matches(".modal-overlay")){this.hideModal();return}}),document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.matches('.rule-form input:not([type="checkbox"]), .rule-form select')){e.preventDefault();return}if(e.key!=="Escape")return;if(this.state.showAddRule){this.hideModal();return}let t=document.querySelectorAll(".rules-panel-overlay");if(t.length>0){for(let s of t)s.remove();this.state.showDefaultRulesPanel=!1,this.state.showCustomRulesPanel=!1}}),document.addEventListener("submit",e=>{e.target.matches(".rule-form")&&(e.preventDefault(),this.saveRule())}),document.addEventListener("input",e=>{if(e.target.matches(".rule-search-input")){this.state.ruleSearch=e.target.value,this.updateRulesDisplay();return}e.target.matches(".form-input, .form-select")?this.updateFormField(e.target.name,e.target.value):e.target.matches(".form-checkbox input")&&this.updateFormField(e.target.name,e.target.checked)}),document.addEventListener("change",e=>{e.target.matches("#import-file-input")?this.importCustomRules(e.target):e.target.matches('.find-replace-pair input[type="checkbox"]')?this.updateFormField(e.target.name,e.target.checked):e.target.matches(".form-checkbox input")?this.updateFormField(e.target.name,e.target.checked):e.target.matches(".block-value-kind")?this.updateBlockValueKind(parseInt(e.target.getAttribute("data-block-idx"),10)):e.target.matches("select.blockType")?this.updateBlockType(parseInt(e.target.getAttribute("data-block-idx"),10)):e.target.matches("select.form-input")&&(this.updateFormField(e.target.name,e.target.value),e.target.name.startsWith("jsonField-")&&e.target.name.endsWith("-action")?this.updateJsonFieldsList():e.target.name.startsWith("headerRule-")&&e.target.name.endsWith("-action")?this.updateHeaderRulesList():e.target.name.startsWith("urlParam-")&&e.target.name.endsWith("-action")?this.updateUrlParamsList():e.target.name==="targetType"&&this.refreshModal())})}async refreshData(e=0){try{let a=await this.sendMessage({action:"getStatus"});if(a){if(this.state.isEnabled=a.isEnabled,this.state.rules=a.rules||[],this.state.stats=a.stats||this.state.stats,this.state.activityLog=a.activityLog||[],this.state.ruleStats=a.ruleStats||{},this.state.defaultRulesEnabled=a.hasDefaultRules||!1,this.state.categories=a.categories||[],this.state.version=a.version||null,this.state.versionError=a.versionError||null,this.state.rules.length===0&&this.state.defaultRulesEnabled&&e<10){setTimeout(()=>this.refreshData(e+1),600);return}this.state.loading=!1,this.render()}else e<10?setTimeout(()=>this.refreshData(e+1),600):(this.state.loading=!1,this.render(),this.showErrorMessage("Failed to connect to extension background script"))}catch{if(e<3){setTimeout(()=>this.refreshData(e+1),600);return}this.state.loading=!1,this.showErrorMessage("Failed to connect to extension background script")}}startAutoRefresh(){this.autoRefreshInterval=setInterval(()=>{this.refreshDataAndUpdateDisplay()},5e3)}stopAutoRefresh(){this.autoRefreshInterval&&(clearInterval(this.autoRefreshInterval),this.autoRefreshInterval=null)}async sendMessage(e){return new Promise(t=>{try{chrome.runtime.sendMessage(e,s=>{chrome.runtime.lastError?(console.error("Chrome runtime error:",chrome.runtime.lastError),t(null)):t(s)})}catch(s){console.error("Error sending message:",s),t(null)}})}async toggleEnabled(){try{let e=await this.sendMessage({action:"toggleEnabled"});if(e&&e.isEnabled!==void 0){this.state.isEnabled=e.isEnabled,this.updateStatusDisplay();let t=document.querySelector(".header-controls .toggle-switch:not(.default-rules-toggle)");t&&(this.state.isEnabled?t.classList.add("active"):t.classList.remove("active"),this.showSuccessAnimation(t))}else this.showErrorMessage("Failed to toggle extension. Please try again.")}catch(e){console.error("Error toggling extension:",e),this.showErrorMessage("An error occurred while toggling the extension. Please try again.")}}updateRulesDisplay(){try{let e=this.state.rules.filter(i=>i.isDefault),t=this.state.rules.filter(i=>!i.isDefault),s=document.querySelector(".panel-card.default-panel .panel-count");s&&(s.textContent=e.filter(i=>i.enabled!==!1).length);let a=document.querySelector(".panel-card.custom-panel .panel-count");if(a&&(a.textContent=t.filter(i=>i.enabled!==!1).length),this.state.showDefaultRulesPanel){let i=this.state.activeCategory||"all",l=this._filterRules(i==="all"?e:e.filter(o=>o.category===i));document.querySelectorAll('.rules-panel-overlay[data-panel="default"] .category-tab').forEach(o=>o.classList.toggle("active",o.getAttribute("data-category")===i));let c=document.querySelector('.rules-panel-overlay[data-panel="default"] .rules-list-panel');if(c)if(l.length>0)c.innerHTML=l.map(o=>this.getCompactRuleItem(o)).join("");else{let o=!!(this.state.ruleSearch&&this.state.ruleSearch.trim());c.innerHTML='<div class="empty-state-compact"><span class="empty-text">'+(o?"No rules match your search":"No rules in this category")+"</span></div>"}}this.state.showCustomRulesPanel&&this.renderCustomPanel()}catch(e){console.error("Error updating rules display:",e)}}renderCustomPanel(){let e=this._filterRules(this.state.rules.filter(s=>!s.isDefault)),t=document.querySelector('.rules-panel-overlay[data-panel="custom"] .panel-content');if(t)if(e.length>0)t.innerHTML=`<div class="rules-list-panel">${e.map(s=>this.getRuleItem(s)).join("")}</div>`;else{let s=!!(this.state.ruleSearch&&this.state.ruleSearch.trim());t.innerHTML=`
				<div class="empty-state">
					<div class="empty-state-icon">${s?"\u{1F50D}":"\u{1F4DD}"}</div>
					<div class="empty-state-text">${s?"No rules match your search":"No custom rules configured"}</div>
					${s?"":'<button class="btn btn-primary btn-add-rule">Create your first rule</button>'}
				</div>
			`}}updateStatusDisplay(){try{let e=document.querySelector(".status-indicator");if(e){let s=e.querySelector(".status-dot"),a=e.querySelector(".status-text");s&&(this.state.isEnabled?s.classList.add("active"):s.classList.remove("active")),a&&(a.textContent=this.state.isEnabled?"Active":"Inactive")}let t=document.querySelectorAll(".stat-value");t.length>=6&&(t[0].textContent=this.state.stats.modifiedRequests||0,t[1].textContent=this.state.stats.urlModifications||0,t[2].textContent=this.state.stats.postModifications||0,t[3].textContent=this.state.stats.responseModifications||0,t[4].textContent=this.state.stats.blockedRequests||0,t[5].textContent=this.state.stats.headerModifications||0)}catch(e){console.error("Error updating status display:",e)}}updateActivityDisplay(){try{let e=document.querySelector(".activity-log-list");if(!e)return;let t=this.state.activityLog||[];t.length>0?e.innerHTML=t.map(a=>this.getActivityEntry(a)).join(""):e.innerHTML=this.getActivityEmptyState();let s=document.querySelector(".activity-count");s&&(s.textContent=t.length+(t.length===1?" entry":" entries"))}catch(e){console.error("Error updating activity display:",e)}}async refreshDataAndUpdateDisplay(){try{let e=await this.sendMessage({action:"getStatus"});if(e){let t=JSON.stringify(this.state.stats)!==JSON.stringify(e.stats),s=JSON.stringify(this.state.ruleStats||{})!==JSON.stringify(e.ruleStats||{}),a=JSON.stringify(this.state.rules)!==JSON.stringify(e.rules),i=e.activityLog||[],l=this.state.activityLog.length!==i.length||this.state.activityLog.length>0&&JSON.stringify(this.state.activityLog)!==JSON.stringify(i),n=this.state.isEnabled!==e.isEnabled,c=this.state.defaultRulesEnabled!==e.hasDefaultRules;this.state.isEnabled=e.isEnabled,this.state.rules=e.rules||[],this.state.stats=e.stats||this.state.stats,this.state.activityLog=i,this.state.ruleStats=e.ruleStats||{},this.state.defaultRulesEnabled=e.hasDefaultRules||!1,this.state.categories=e.categories||[],this.state.version=e.version||null,(t||s||a||l||n||c)&&(this.updateStatusDisplay(),this.updateRulesDisplay(),l&&this.updateActivityDisplay())}}catch{}}getDefaultNewRule(){return{title:"",findReplacePairs:[{find:"",replace:"",useRegex:!1,targetType:"all"}],targetType:"findReplace",description:"",urlMatch:"",category:"",jsonFields:[],headerRules:[],mockStatus:200,mockBody:"",mockContentType:"application/json",delayMin:1e3,delayMax:1e3,injectCode:"",injectTiming:"document_start",urlParams:[],captures:[],blocks:[this._newBlock("findReplace")]}}showAddRuleModal(){this.state.showAddRule=!0,this.state.editingRule=null,this.newRule=this.getDefaultNewRule(),this._newRuleSnapshot=JSON.stringify(this.newRule);let e=document.querySelector(".modal-overlay");e&&e.remove();let t=this.getModal();document.body.insertAdjacentHTML("beforeend",t),requestAnimationFrame(()=>{let s=document.querySelector(".modal-overlay");if(s){s.classList.add("show");let a=s.querySelector('input[name="title"]');a&&a.focus()}})}editRule(e){let t=this.state.rules.find(s=>s.id===e);if(t){if(t._protected){this.duplicateRule(e);return}this.state.showAddRule=!0,this.state.editingRule=e,this.newRule=this._buildNewRuleFromRule(t),this._newRuleSnapshot=JSON.stringify(this.newRule),this.refreshModal(!0)}}duplicateRule(e){let t=this.state.rules.find(s=>s.id===e);t&&(this.state.showAddRule=!0,this.state.editingRule=null,this.newRule=this._buildNewRuleFromRule(t,!0),this._newRuleSnapshot=JSON.stringify(this.newRule),this.refreshModal(!0))}_buildNewRuleFromRule(e,t){let s=e.targetType==="block"||e.targetType==="headers"||e.targetType==="jsonBody"||e.targetType==="mock"||e.targetType==="delay"||e.targetType==="inject"?e.targetType:"findReplace",a=[],i=Array.isArray(e.urlParams)&&e.urlParams.length>0;Array.isArray(e.findReplacePairs)&&e.findReplacePairs.length>0?a=e.findReplacePairs.filter(n=>!(i&&n._fromParam)).map(n=>({...n,targetType:n.targetType||s==="findReplace"&&e.targetType||"all"})):a=[{find:"",replace:"",useRegex:!1,targetType:"all"}];let l={title:(e.title||"")+(t?" (copy)":""),findReplacePairs:a,targetType:s,description:e.description||"",urlMatch:e.urlMatch||"",enabled:e.enabled!==!1,category:e.category||"",jsonFields:Array.isArray(e.jsonFields)?e.jsonFields.map(n=>({...n})):[],headerRules:Array.isArray(e.headerRules)?e.headerRules.map(n=>({...n})):[],urlParams:Array.isArray(e.urlParams)?e.urlParams.map(n=>({...n})):[],mockStatus:e.mockStatus!=null?e.mockStatus:200,mockBody:e.mockBody||"",mockContentType:e.mockContentType||"application/json",delayMin:e.delayMin!=null?e.delayMin:1e3,delayMax:e.delayMax!=null?e.delayMax:1e3,injectCode:e.injectCode||"",injectTiming:e.injectTiming||"document_start",captures:Array.isArray(e.captures)?e.captures.map(n=>({...n})):[],blocks:this._decodeRuleToBlocks(e,a,s)};return t||(l.id=e.id),l}_decodeRuleToBlocks(e,t,s){let a=[];if(Array.isArray(e.urlParams)){for(let l of e.urlParams)if(!(!l||!l.name))if(l.action==="delete")a.push({type:"removeUrlParam",valueKind:"text",params:{paramName:l.name}});else{let n={type:"setUrlParam",valueKind:"text",params:{paramName:l.name,value:l.value||""}},c=this._decodeValueKind(l.value);c&&(n.valueKind=c.valueKind,n.params=Object.assign({},n.params,c.params)),a.push(n)}}let i=Array.isArray(e.urlParams)&&e.urlParams.length>0;for(let l of t||[]){if(i&&l._fromParam||!l||!l.find)continue;let n={type:"findReplace",valueKind:"text",params:{find:l.find,value:l.replace||"",targetType:l.targetType||"all",urlMatch:l.urlMatch||"",useRegex:!!l.useRegex}},c=this._decodeValueKind(l.replace);c&&(n.valueKind=c.valueKind,n.params=Object.assign({},n.params,c.params)),a.push(n)}for(let l of e.jsonFields||[])if(!(!l||!l.path))if(l.action==="delete")a.push({type:"deleteJson",valueKind:"text",params:{path:l.path}});else if(l.action==="rename")a.push({type:"renameJson",valueKind:"text",params:{path:l.path,newName:l.newName||""}});else{let n={type:"setJson",valueKind:"text",params:{path:l.path,value:l.value!==void 0?l.value:""}},c=this._decodeValueKind(l.value);c&&(n.valueKind=c.valueKind,n.params=Object.assign({},n.params,c.params)),a.push(n)}for(let l of e.headerRules||[])if(!(!l||!l.header))if(l.action==="remove")a.push({type:"removeHeader",valueKind:"text",params:{header:l.header}});else if(l.action==="rename")a.push({type:"renameHeader",valueKind:"text",params:{header:l.header,newName:l.newName||""}});else{let n={type:"setHeader",valueKind:"text",params:{header:l.header,value:l.value!==void 0?l.value:"",scope:l.scope==="response"?"response":"request"}},c=this._decodeValueKind(l.value);c&&(n.valueKind=c.valueKind,n.params=Object.assign({},n.params,c.params)),a.push(n)}for(let l of e.captures||[])!l||!l.name||!l.pattern||a.push({type:"capture",valueKind:"text",params:{name:l.name,pattern:l.pattern}});return a.length===0&&s!=="findReplace"&&(s==="block"?a.push({type:"block",valueKind:"text",params:{}}):s==="mock"?a.push({type:"mock",valueKind:"text",params:{}}):s==="delay"?a.push({type:"delay",valueKind:"text",params:{}}):s==="inject"&&a.push({type:"inject",valueKind:"text",params:{}})),a.length===0&&a.push(this._newBlock("findReplace")),a}_decodeValueKind(e){if(typeof e!="string")return null;let t=e.match(/^\$var\{([A-Za-z0-9_-]+),(\d+),(\d+)\}$/);return t?{valueKind:"random",params:{name:t[1],min:t[2],max:t[3]}}:e==="$ts{ms}"?{valueKind:"timestamp",params:{unit:"ms"}}:e==="$ts{}"?{valueKind:"timestamp",params:{unit:"s"}}:(t=e.match(/^\$capture\{([A-Za-z0-9_-]+)\}$/),t?{valueKind:"capture",params:{name:t[1]}}:null)}async saveRule(){if(!this._saving){this._saving=!0;try{let t=this.newRule.targetType||"findReplace",s=t==="findReplace";if(s){let d=(this.newRule.findReplacePairs||[]).some(p=>p&&p.find&&p.find.trim()),h=this.newRule.urlParams&&this.newRule.urlParams.some(p=>p.name&&p.name.trim()),E=(this.newRule.blocks||[]).some(p=>p&&p.type==="findReplace"&&(p.params||{}).find&&String(p.params.find).trim()),H=(this.newRule.blocks||[]).some(p=>p&&p.type!=="findReplace"&&p.type!=="block"&&p.type!=="mock"&&p.type!=="delay"&&p.type!=="inject");if(!d&&!h&&!E&&!H){this.showErrorMessage("Add at least one block (Find & Replace, JSON field, header, URL param, capture\u2026).");return}}if((t==="block"||t==="mock")&&(!this.newRule.urlMatch||!this.newRule.urlMatch.trim())){this.showErrorMessage("URL match pattern is required for block and mock rules.");return}if(t==="inject"&&(!this.newRule.injectCode||!this.newRule.injectCode.trim())){this.showErrorMessage("JavaScript code is required for script injection rules.");return}let a=this.newRule.jsonFields&&this.newRule.jsonFields.some(r=>r.path&&r.path.trim()),i=this.newRule.findReplacePairs&&this.newRule.findReplacePairs.some(r=>r.find&&r.find.trim()),l=(this.newRule.blocks||[]).some(r=>r&&(r.type==="setJson"||r.type==="deleteJson"||r.type==="renameJson")&&(r.params||{}).path&&String(r.params.path).trim()),n=(this.newRule.blocks||[]).some(r=>r&&(r.type==="setHeader"||r.type==="removeHeader"||r.type==="renameHeader")&&(r.params||{}).header&&String(r.params.header).trim());if(t==="headers"&&!n&&(!this.newRule.headerRules||!this.newRule.headerRules.some(r=>r.header&&r.header.trim()))){this.showErrorMessage("At least one header block with a header name is required.");return}if(t==="jsonBody"&&!l&&!a&&!i){this.showErrorMessage("At least one JSON field block with a path is required.");return}if(!this.newRule.title||!this.newRule.title.trim()){let r=(this.newRule.blocks||[]).find(d=>d&&d.type==="findReplace"&&(d.params||{}).find&&String(d.params.find).trim());if(s&&r){let d=String(r.params.find).trim();this.newRule.title=`Rule for "${d.substring(0,20)}${d.length>20?"...":""}"`}else if(s&&this.newRule.findReplacePairs&&this.newRule.findReplacePairs.length>0){var e=this.newRule.findReplacePairs[0];this.newRule.title=`Rule for "${e.find.substring(0,20)}${e.find.length>20?"...":""}"`}else this.newRule.title=t==="block"?"Block Rule":t==="mock"?"Mock Response":t==="delay"?"Delay Rule":t==="inject"?"Injected Script":"Untitled Rule"}let c=this.normalizeUrlPatterns(this.newRule.urlMatch||""),o={title:this.newRule.title.trim(),description:(this.newRule.description||"").trim(),urlMatch:c,enabled:this.newRule.enabled!==!1,category:(this.newRule.category||"").trim()};o.targetType=t==="findReplace"?"":t;let u=this._compileBlocks(this.newRule.blocks||[],t),f=(this.newRule.findReplacePairs||[]).filter(r=>r&&r.find&&r.find.trim()).map(r=>({find:r.find.trim(),replace:r.replace||"",useRegex:!!r.useRegex,targetType:r.targetType||"all",urlMatch:r.urlMatch||""})),m=f.slice();if(u.pairs.length>0){let r=new Set(u.pairs.map(d=>d.find));m=u.pairs.slice();for(let d of f)r.has(d.find)||m.push(d)}else if(t==="findReplace"){let r=this._paramOpsToPairs(this.newRule.urlParams);for(let d of r)m.some(h=>h.find===d.find)||m.push(d)}m.length>0&&(o.findReplacePairs=m);let v=(this.newRule.urlParams||[]).filter(r=>r.name&&r.name.trim()),g=u.urlParams.concat(v),k=new Set,y=[];for(let r of g){let d=(r.action||"set")+":"+r.name;k.has(d)||(k.add(d),y.push(r))}y.length>0&&(o.urlParams=y);let M=(this.newRule.jsonFields||[]).filter(r=>r&&r.path&&r.path.trim()).map(r=>({action:r.action||"set",path:r.path.trim(),value:r.value||"",newName:r.newName||""})),x=new Set,b=[];for(let r of u.jsonFields.concat(M)){let d=(r.action||"set")+":"+r.path;x.has(d)||(x.add(d),b.push(r))}b.length>0&&(o.jsonFields=b);let T=(this.newRule.headerRules||[]).filter(r=>r&&r.header&&r.header.trim()).map(r=>({action:r.action||"set",header:r.header.trim(),value:r.value||"",newName:r.newName||"",scope:r.scope==="response"?"response":"request"})),P=new Set,R=[];for(let r of u.headerRules.concat(T)){let d=(r.action||"set")+":"+r.scope+":"+r.header;P.has(d)||(P.add(d),R.push(r))}if(R.length>0&&(o.headerRules=R),u.captures.length>0&&(o.captures=u.captures),t==="mock"&&(o.mockStatus=parseInt(this.newRule.mockStatus,10)||200,o.mockBody=this.newRule.mockBody||"",o.mockContentType=this.newRule.mockContentType||"application/json"),t==="delay"){let r=parseInt(this.newRule.delayMin,10),d=parseInt(this.newRule.delayMax,10);o.delayMin=isNaN(r)||r<0?1e3:r,o.delayMax=isNaN(d)||d<0?1e3:Math.max(r,d)}if(t==="inject"&&(o.injectCode=this.newRule.injectCode||"",o.injectTiming=this.newRule.injectTiming==="dom_ready"?"dom_ready":"document_start"),this.state.editingRule){o.id=this.newRule.id;let r=await this.sendMessage({action:"updateRule",ruleId:o.id,updates:o});if(r&&r.success){let d=this.state.rules.findIndex(h=>h.id===o.id);d!==-1&&(this.state.rules[d]={...this.state.rules[d],...o},delete this.state.rules[d].searchText,delete this.state.rules[d].replaceText,delete this.state.rules[d].useRegex)}else{this.showErrorMessage("Failed to update rule. Please try again.");return}}else{let r=await this.sendMessage({action:"addRule",rule:o});if(r&&r.success)this.state.rules.push(r.rule);else{this.showErrorMessage("Failed to add rule. Please try again.");return}}this.newRule=this.getDefaultNewRule(),this._newRuleSnapshot=JSON.stringify(this.newRule),this.hideModal();let S=document.querySelector(".panel-card.custom-panel .panel-count");S&&(S.textContent=this.state.rules.filter(r=>!r.isDefault&&r.enabled!==!1).length),setTimeout(()=>{this.updateRulesDisplay(),this.state.showCustomRulesPanel&&this.renderCustomPanel()},250)}catch(t){console.error("Error saving rule:",t),this.showErrorMessage("An error occurred while saving the rule. Please try again.")}finally{this._saving=!1}}}async deleteRule(e){try{let t=this.state.rules.find(i=>i.id===e);if(!t){this.showErrorMessage("Rule not found.");return}if(t.isDefault||t._protected){this.showErrorMessage("Protected rules cannot be deleted. You can disable them instead.");return}if(!confirm(`Are you sure you want to delete the rule "${t.title||"Untitled Rule"}"?`))return;let s=t.title||"Untitled Rule",a=await this.sendMessage({action:"deleteRule",ruleId:e});if(a&&a.success){this.state.rules=this.state.rules.filter(l=>l.id!==e);let i=document.querySelector(".panel-card.custom-panel .panel-count");i&&(i.textContent=this.state.rules.filter(l=>!l.isDefault&&l.enabled!==!1).length),this.updateRulesDisplay(),this.state.showCustomRulesPanel&&this.renderCustomPanel()}else this.showErrorMessage("Failed to delete rule. Please try again.")}catch(t){console.error("Error deleting rule:",t),this.showErrorMessage("An error occurred while deleting the rule. Please try again.")}}async moveRule(e,t){try{let s=await this.sendMessage({action:"moveRule",ruleId:e,direction:t});if(s&&s.success){let a=this.state.rules.findIndex(i=>i.id===e);if(a!==-1){let i=a+t;if(i>=0&&i<this.state.rules.length){let l=this.state.rules[a];this.state.rules[a]=this.state.rules[i],this.state.rules[i]=l}}this.updateRulesDisplay()}else this.showErrorMessage("Failed to move rule. Please try again.")}catch(s){console.error("Error moving rule:",s)}}async clearActivityLog(){try{await this.sendMessage({action:"clearActivityLog"}),this.state.activityLog=[];let e=document.querySelector(".activity-log-list");e&&(e.innerHTML=this.getActivityEmptyState());let t=document.querySelector(".activity-count");t&&(t.textContent="0 entries")}catch(e){console.error("Error clearing activity log:",e)}}async toggleRule(e){try{let t=this.state.rules.find(i=>i.id===e);if(!t){this.showErrorMessage("Rule not found.");return}let s=!t.enabled,a=await this.sendMessage({action:"updateRule",ruleId:e,updates:{enabled:s}});if(a&&a.success){t.enabled=s,this.updateRulesDisplay();let i=document.querySelector(`[data-rule-id="${e}"]`);i&&this.showSuccessAnimation(i)}else this.showErrorMessage("Failed to toggle rule. Please try again.")}catch(t){console.error("Error toggling rule:",t),this.showErrorMessage("An error occurred while toggling the rule. Please try again.")}}showDefaultRulesPanel(){this.state.showDefaultRulesPanel=!0,this.state.showCustomRulesPanel=!1;let e=document.querySelector(".rules-panel-overlay");e&&e.remove();let t=this.state.rules.filter(a=>a.isDefault),s=this.getDefaultRulesPanel(t);document.body.insertAdjacentHTML("beforeend",s),requestAnimationFrame(()=>{let a=document.querySelector(".rules-panel-overlay");a&&a.classList.add("show")})}showCustomRulesPanel(){this.state.showCustomRulesPanel=!0,this.state.showDefaultRulesPanel=!1;let e=document.querySelector(".rules-panel-overlay");e&&e.remove();let t=this.state.rules.filter(a=>!a.isDefault),s=this.getCustomRulesPanel(t);document.body.insertAdjacentHTML("beforeend",s),requestAnimationFrame(()=>{let a=document.querySelector(".rules-panel-overlay");a&&a.classList.add("show")})}closePanels(e){let t=document.querySelector(".rules-panel-overlay");t?(t.classList.add("closing"),setTimeout(()=>{t.classList.remove("show"),t.classList.remove("closing"),e==="default"?this.state.showDefaultRulesPanel=!1:e==="custom"&&(this.state.showCustomRulesPanel=!1),t.remove()},250)):e==="default"?this.state.showDefaultRulesPanel=!1:e==="custom"&&(this.state.showCustomRulesPanel=!1)}hideModal(){if(this._hasUnsavedChanges()&&!confirm("You have unsaved changes. Close anyway?"))return;this.state.showAddRule=!1,this.state.editingRule=null;let e=document.querySelector(".modal-overlay");e&&(e.classList.remove("show"),setTimeout(()=>{e.remove()},250))}_hasUnsavedChanges(){return!this.newRule||!this._newRuleSnapshot?!1:JSON.stringify(this.newRule)!==this._newRuleSnapshot}updateFormField(e,t){if(e.startsWith("pair-")){let s=e.split("-");if(s.length<3)return;let a=s[1],i=s[2],l=parseInt(a,10);if(isNaN(l)||l<0)return;this.newRule.findReplacePairs||(this.newRule.findReplacePairs=[]),this.newRule.findReplacePairs[l]||(this.newRule.findReplacePairs[l]={find:"",replace:"",useRegex:!1,targetType:"all"}),i==="useRegex"?this.newRule.findReplacePairs[l][i]=t===!0||t==="true":i==="find"||i==="replace"?this.newRule.findReplacePairs[l][i]=t||"":i==="targetType"?this.newRule.findReplacePairs[l][i]=t||"all":i==="urlMatch"&&(this.newRule.findReplacePairs[l][i]=t||"");return}if(e.startsWith("jsonField-")){let s=e.split("-");if(s.length<3)return;let a=parseInt(s[1],10),i=s.slice(2).join("-");if(isNaN(a)||a<0)return;this.newRule.jsonFields||(this.newRule.jsonFields=[]),this.newRule.jsonFields[a]||(this.newRule.jsonFields[a]={action:"set",path:"",value:"",newName:""}),this.newRule.jsonFields[a][i]=t||"";return}if(e.startsWith("urlParam-")){let s=e.split("-");if(s.length<3)return;let a=parseInt(s[1],10),i=s.slice(2).join("-");if(isNaN(a)||a<0)return;this.newRule.urlParams||(this.newRule.urlParams=[]),this.newRule.urlParams[a]||(this.newRule.urlParams[a]={action:"set",name:"",value:""}),this.newRule.urlParams[a][i]=t||"";return}if(e.startsWith("headerRule-")){let s=e.split("-");if(s.length<3)return;let a=parseInt(s[1],10),i=s.slice(2).join("-");if(isNaN(a)||a<0)return;this.newRule.headerRules||(this.newRule.headerRules=[]),this.newRule.headerRules[a]||(this.newRule.headerRules[a]={action:"set",header:"",value:"",newName:""}),this.newRule.headerRules[a][i]=t||"";return}if(e.startsWith("block-")){let s=e.split("-");if(s.length<3)return;let a=parseInt(s[1],10),i=s.slice(2).join("-");if(isNaN(a)||a<0)return;this.newRule.blocks||(this.newRule.blocks=[]),this.newRule.blocks[a]||(this.newRule.blocks[a]={type:"findReplace",valueKind:"text",params:{}}),i==="valueKind"?this.newRule.blocks[a][i]=t||"text":(this.newRule.blocks[a].params||(this.newRule.blocks[a].params={}),this.newRule.blocks[a].params[i]=t??"");return}this.newRule&&this.newRule.hasOwnProperty(e)&&(this.newRule[e]=t)}normalizeUrlPatterns(e){let t=[];return typeof e=="string"?t=e.split(`
`).map(s=>s.trim()).filter(s=>s.length>0):Array.isArray(e)&&(t=e.map(s=>String(s).trim()).filter(s=>s.length>0)),t.length===0?"":t.length===1?t[0]:t}addFindReplacePair(){try{this.newRule.findReplacePairs||(this.newRule.findReplacePairs=[]),this.newRule.findReplacePairs.push({find:"",replace:"",useRegex:!1,targetType:"all"}),this.updateModalPairs()}catch(e){console.error("Error adding find/replace pair:",e)}}removeFindReplacePair(e){try{if(!this.newRule.findReplacePairs||this.newRule.findReplacePairs.length<=1)return;e>=0&&e<this.newRule.findReplacePairs.length&&(this.newRule.findReplacePairs.splice(e,1),this.updateModalPairs())}catch(t){console.error("Error removing find/replace pair:",t)}}_getBlockOptions(){return[["findReplace","Find & Replace"],["setJson","Set JSON Field"],["deleteJson","Delete JSON Field"],["renameJson","Rename JSON Field"],["setHeader","Set Header"],["removeHeader","Remove Header"],["renameHeader","Rename Header"],["setUrlParam","Set URL Param"],["removeUrlParam","Remove URL Param"],["capture","Capture from Response"]]}_getValueKindOptions(){return[["text","Text"],["random","Random Number"],["timestamp","Timestamp"],["capture","Captured Value"]]}_newBlock(e){let t={type:e||"findReplace",valueKind:"text",params:{}};switch(t.type){case"findReplace":t.params={find:"",value:"",targetType:"all",urlMatch:"",useRegex:!1};break;case"setJson":t.params={path:"",valueKind:"text",value:"",min:"",max:"",name:"",unit:"s"};break;case"deleteJson":t.params={path:""};break;case"renameJson":t.params={path:"",newName:""};break;case"setHeader":t.params={header:"",valueKind:"text",value:"",min:"",max:"",name:"",unit:"s",scope:"request"};break;case"removeHeader":t.params={header:""};break;case"renameHeader":t.params={header:"",newName:""};break;case"setUrlParam":t.params={paramName:"",valueKind:"text",value:"",min:"",max:"",name:"",unit:"s"};break;case"removeUrlParam":t.params={paramName:""};break;case"capture":t.params={name:"",pattern:""};break}return t}addBlock(){this.newRule.blocks||(this.newRule.blocks=[]),this.newRule.blocks.push(this._newBlock("findReplace")),this.updateBlocksList()}removeBlock(e){this.newRule.blocks&&e>=0&&e<this.newRule.blocks.length&&(this.newRule.blocks.splice(e,1),this.updateBlocksList())}moveBlock(e,t){if(!this.newRule.blocks)return;let s=e+t;if(s<0||s>=this.newRule.blocks.length)return;let a=this.newRule.blocks[e];this.newRule.blocks[e]=this.newRule.blocks[s],this.newRule.blocks[s]=a,this.updateBlocksList()}updateBlockType(e){if(!this.newRule.blocks||!this.newRule.blocks[e])return;let t=this.newRule.blocks[e],s=document.querySelector(`select.blockType[data-block-idx="${e}"]`),a=s?s.value:t.type;if(a===t.type)return;let i=this._newBlock(a);i.params=Object.assign({},i.params,{path:t.params.path||i.params.path,header:t.params.header||i.params.header,name:t.params.name||i.params.name,paramName:t.params.paramName||i.params.paramName,find:t.params.find||i.params.find}),this.newRule.blocks[e]=i,this.updateBlocksList()}updateBlockValueKind(e){if(!this.newRule.blocks||!this.newRule.blocks[e])return;let t=document.querySelector(`select.block-value-kind[data-block-idx="${e}"]`);t&&(this.newRule.blocks[e].valueKind=t.value||"text",this.newRule.blocks[e].params||(this.newRule.blocks[e].params={})),this.updateBlocksList()}_compileBlockValue(e,t,s){if(t||(t={}),e==="random"){let a=parseInt(t.min,10),i=parseInt(t.max,10);(isNaN(a)||isNaN(i)||a>i)&&(a=0,i=999999);let l=(t.name||"").trim();if(!l){let n=0;do l="v"+n,n++;while(s.has(l));s.add(l)}return`$var{${l},${a},${i}}`}if(e==="timestamp")return t.unit==="ms"?"$ts{ms}":"$ts{}";if(e==="capture"){let a=(t.name||"").trim();return a?`$capture{${a}}`:""}return t.value!==void 0&&t.value!==null?String(t.value):""}_compileBlocks(e,t){let s={pairs:[],jsonFields:[],headerRules:[],urlParams:[],captures:[]};if(!Array.isArray(e))return s;let a=new Set,i=t==="block"||t==="mock"||t==="delay"||t==="inject";for(let l of e){if(!l||!l.type)continue;let n=l.params||{},c=l.valueKind||"text";switch(l.type){case"findReplace":{let o=(n.find||"").trim();if(!o)break;let u=this._compileBlockValue(c,n,a);s.pairs.push({find:o,replace:u,useRegex:!!n.useRegex,targetType:n.targetType||"all",urlMatch:(n.urlMatch||"").trim()});break}case"setJson":{let o=(n.path||"").trim();if(!o)break;let u=this._compileBlockValue(c,n,a);s.jsonFields.push({action:"set",path:o,value:u,newName:""});break}case"deleteJson":{let o=(n.path||"").trim();o&&s.jsonFields.push({action:"delete",path:o,value:"",newName:""});break}case"renameJson":{let o=(n.path||"").trim(),u=(n.newName||"").trim();o&&u&&s.jsonFields.push({action:"rename",path:o,value:"",newName:u});break}case"setHeader":{let o=(n.header||"").trim();if(!o)break;let u=this._compileBlockValue(c,n,a);s.headerRules.push({action:"set",header:o,value:u,newName:"",scope:n.scope==="response"?"response":"request"});break}case"removeHeader":{let o=(n.header||"").trim();o&&s.headerRules.push({action:"remove",header:o,value:"",newName:"",scope:"request"});break}case"renameHeader":{let o=(n.header||"").trim(),u=(n.newName||"").trim();o&&u&&s.headerRules.push({action:"rename",header:o,value:"",newName:u,scope:"request"});break}case"setUrlParam":{let o=(n.paramName||"").trim();if(!o)break;let u=this._compileBlockValue(c,n,a);s.urlParams.push({action:"set",name:o,value:u});break}case"removeUrlParam":{let o=(n.paramName||"").trim();o&&s.urlParams.push({action:"delete",name:o,value:""});break}case"capture":{let o=(n.name||"").trim(),u=(n.pattern||"").trim();o&&u&&s.captures.push({name:o,pattern:u});break}default:break}}return i?{pairs:[],jsonFields:s.jsonFields,headerRules:s.headerRules,urlParams:[],captures:s.captures}:s}addJsonField(){this.newRule.jsonFields||(this.newRule.jsonFields=[]),this.newRule.jsonFields.push({action:"set",path:"",value:"",newName:""}),this.updateJsonFieldsList()}removeJsonField(e){this.newRule.jsonFields&&e>=0&&e<this.newRule.jsonFields.length&&(this.newRule.jsonFields.splice(e,1),this.updateJsonFieldsList())}addHeaderRule(){this.newRule.headerRules||(this.newRule.headerRules=[]),this.newRule.headerRules.push({action:"set",header:"",value:"",newName:"",scope:"request"}),this.updateHeaderRulesList()}removeHeaderRule(e){this.newRule.headerRules&&e>=0&&e<this.newRule.headerRules.length&&(this.newRule.headerRules.splice(e,1),this.updateHeaderRulesList())}addUrlParam(){this.newRule.urlParams||(this.newRule.urlParams=[]),this.newRule.urlParams.push({action:"set",name:"",value:""}),this.updateUrlParamsList()}removeUrlParam(e){this.newRule.urlParams&&e>=0&&e<this.newRule.urlParams.length&&(this.newRule.urlParams.splice(e,1),this.updateUrlParamsList())}_urlParamRowsHtml(){return(this.newRule.urlParams||[]).map((t,s)=>`
			<div class="url-param-row" data-param-idx="${s}">
				<select name="urlParam-${s}-action" class="form-input form-input-sm" style="width:auto;min-width:80px">
					<option value="set" ${t.action!=="delete"?"selected":""}>Set Value</option>
					<option value="delete" ${t.action==="delete"?"selected":""}>Delete</option>
				</select>
				<input type="text" name="urlParam-${s}-name" class="form-input form-input-sm" placeholder="Param name" value="${this.escapeHtml(t.name||"")}">
				${t.action!=="delete"?`<input type="text" name="urlParam-${s}-value" class="form-input form-input-sm" placeholder="New value (supports $rand{}, $var{}, $ts{}, $capture{})" value="${this.escapeHtml(t.value||"")}">`:""}
				<button type="button" class="btn btn-icon btn-secondary btn-sm btn-remove-url-param" data-param-idx="${s}" title="Remove">\u2715</button>
			</div>
		`).join("")}updateUrlParamsList(){let e=document.querySelector(".url-params-list");if(!e)return;(this.newRule.urlParams||[]).length===0?e.innerHTML='<div class="empty-hint">No URL parameter operations. Click "+ Add Param" to add one.</div>':e.innerHTML=this._urlParamRowsHtml()}_paramOpsToPairs(e){let t=[];for(let s of e||[]){let a=(s.name||"").trim();if(!a)continue;let i=a.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");s.action==="delete"?(t.push({find:"([?&]"+i+"=[^&]*)(?=&)",replace:"$1",useRegex:!0,targetType:"url",_fromParam:!0}),t.push({find:"[?&]"+i+"=[^&]*$",replace:"",useRegex:!0,targetType:"url",_fromParam:!0}),t.push({find:"&&",replace:"&",useRegex:!1,targetType:"url",_fromParam:!0})):t.push({find:"([?&]"+i+"=)[^&]*",replace:"$1"+(s.value||"").replace(/\$/g,"$$$$"),useRegex:!0,targetType:"url",_fromParam:!0})}return t}_blockValueEditor(e,t,s){let a=t.params||{},i=t.valueKind||"text",l=this._getValueKindOptions().map(([c,o])=>`<option value="${c}" ${i===c?"selected":""}>${o}</option>`).join(""),n="";if(i==="random")n=`
				<div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
					<input type="number" name="${e}-min" class="form-input form-input-sm block-min" style="width:110px" placeholder="Min" value="${this.escapeHtml(a.min||"")}">
					<input type="number" name="${e}-max" class="form-input form-input-sm block-max" style="width:110px" placeholder="Max" value="${this.escapeHtml(a.max||"")}">
					<input type="text" name="${e}-name" class="form-input form-input-sm block-name" style="flex:1" placeholder="Variable name (optional \u2014 same name = same value)" value="${this.escapeHtml(a.name||"")}">
				</div>`;else if(i==="timestamp")n=`
				<select name="${e}-unit" class="form-input form-input-sm block-unit" style="width:auto">
					<option value="s" ${a.unit!=="ms"?"selected":""}>Seconds</option>
					<option value="ms" ${a.unit==="ms"?"selected":""}>Milliseconds</option>
				</select>`;else if(i==="capture"){let c=(this.newRule.blocks||[]).filter(u=>u.type==="capture"&&(u.params||{}).name&&String(u.params.name).trim()).map(u=>String(u.params.name).trim()),o='<option value="">\u2014 select a Capture block \u2014</option>';c.length>0?o+=c.map(u=>`<option value="${this.escapeHtml(u)}" ${a.name===u?"selected":""}>${this.escapeHtml(u)}</option>`).join(""):o+=`<option value="${this.escapeHtml(a.name||"")}" ${a.name?"selected":""}>${this.escapeHtml(a.name||"")}</option>`,n=`<select name="${e}-name" class="form-input form-input-sm block-capture-name" style="flex:1">${o}</select>`}else n=`<input type="text" name="${e}-value" class="form-input form-input-sm block-value" placeholder="Value" value="${this.escapeHtml(a.value||"")}">`;return`
			<div class="block-value-editor" style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
				<select name="${e}-valueKind" class="form-input form-input-sm block-value-kind" data-block-idx="${e.split("-")[1]}" style="width:auto">
					${l}
				</select>
				${n}
			</div>`}_blockRowHtml(e,t){let s=e.params||{},a=this._getBlockOptions().map(([o,u])=>`<option value="${o}" ${e.type===o?"selected":""}>${u}</option>`).join(""),i=this._getBlockOptions().find(([o])=>o===e.type),l=i?i[1]:"Block",n=`block-${t}`,c="";switch(e.type){case"findReplace":c=`
					<textarea name="${n}-find" class="form-input form-input-sm" rows="2" placeholder="Find (text or regex)">${this.escapeHtml(s.find||"")}</textarea>
					<label class="form-label-sm" style="font-size:11px;margin-top:6px;">Replace</label>
					${this._blockValueEditor(n,e)}
					<div style="display:flex; gap:8px; margin-top:8px; flex-wrap:wrap; align-items:center;">
						<select name="${n}-targetType" class="form-input form-input-sm" style="width:auto">${this._pairTargetOptions(s.targetType||"all")}</select>
						<label class="form-checkbox"><input type="checkbox" name="${n}-useRegex" ${s.useRegex?"checked":""} /><span>Regex</span></label>
					</div>`;break;case"setJson":c=`
					<input type="text" name="${n}-path" class="form-input form-input-sm" placeholder="json.path (e.g. user.name)" value="${this.escapeHtml(s.path||"")}">
					<label class="form-label-sm" style="font-size:11px;margin-top:6px;">Value</label>
					${this._blockValueEditor(n,e)}`;break;case"deleteJson":c=`<input type="text" name="${n}-path" class="form-input form-input-sm" placeholder="json.path to delete" value="${this.escapeHtml(s.path||"")}">`;break;case"renameJson":c=`
					<input type="text" name="${n}-path" class="form-input form-input-sm" placeholder="Existing json.path" value="${this.escapeHtml(s.path||"")}">
					<input type="text" name="${n}-newName" class="form-input form-input-sm" placeholder="New key name" value="${this.escapeHtml(s.newName||"")}">`;break;case"setHeader":c=`
					<div style="display:flex; gap:8px; align-items:center;">
						<select name="${n}-scope" class="form-input form-input-sm" style="width:auto">
							<option value="request" ${s.scope!=="response"?"selected":""}>Request</option>
							<option value="response" ${s.scope==="response"?"selected":""}>Response</option>
						</select>
						<input type="text" name="${n}-header" class="form-input form-input-sm" placeholder="Header name" value="${this.escapeHtml(s.header||"")}">
					</div>
					<label class="form-label-sm" style="font-size:11px;margin-top:6px;">Value</label>
					${this._blockValueEditor(n,e)}`;break;case"removeHeader":c=`<input type="text" name="${n}-header" class="form-input form-input-sm" placeholder="Header name" value="${this.escapeHtml(s.header||"")}">`;break;case"renameHeader":c=`
					<input type="text" name="${n}-header" class="form-input form-input-sm" placeholder="Existing header name" value="${this.escapeHtml(s.header||"")}">
					<input type="text" name="${n}-newName" class="form-input form-input-sm" placeholder="New header name" value="${this.escapeHtml(s.newName||"")}">`;break;case"setUrlParam":c=`
					<input type="text" name="${n}-paramName" class="form-input form-input-sm" placeholder="Param name" value="${this.escapeHtml(s.paramName||"")}">
					<label class="form-label-sm" style="font-size:11px;margin-top:6px;">Value</label>
					${this._blockValueEditor(n,e)}`;break;case"removeUrlParam":c=`<input type="text" name="${n}-paramName" class="form-input form-input-sm" placeholder="Param name" value="${this.escapeHtml(s.paramName||"")}">`;break;case"capture":c=`
					<input type="text" name="${n}-name" class="form-input form-input-sm" placeholder="Capture name (referenced by $capture{name})" value="${this.escapeHtml(s.name||"")}">
					<input type="text" name="${n}-pattern" class="form-input form-input-sm" placeholder="Regex with one capture group, e.g. &quot;csrf&quot;:&quot;([^&quot;]+)&quot;" value="${this.escapeHtml(s.pattern||"")}">`;break}return`
			<div class="block-item" data-block-idx="${t}" style="border:1px solid var(--border,#333); border-radius:8px; padding:10px; margin-bottom:10px; background:var(--bg-elevated,#1c1c1e);">
				<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
					<select name="${n}-type" class="form-input form-input-sm blockType" data-block-idx="${t}" style="width:auto;min-width:170px">
						${a}
					</select>
					<span style="flex:1; font-size:11px; color:var(--text-muted,#999);">${t+1}</span>
					<button type="button" class="btn btn-icon btn-secondary btn-xs btn-move-block-up" data-block-idx="${t}" title="Move up">\u25B2</button>
					<button type="button" class="btn btn-icon btn-secondary btn-xs btn-move-block-down" data-block-idx="${t}" title="Move down">\u25BC</button>
					<button type="button" class="btn btn-icon btn-secondary btn-xs btn-remove-block" data-block-idx="${t}" title="Remove block">\u2715</button>
				</div>
				${c}
			</div>`}updateBlocksList(){let e=document.querySelector(".blocks-list");if(!e)return;let t=this.newRule.blocks||[];t.length===0?e.innerHTML='<div class="empty-hint">No blocks yet. Click "+ Add Block" to add one \u2014 like OpenBullet, each block does one thing (find/replace, JSON field, header, URL param, capture\u2026).</div>':e.innerHTML=t.map((s,a)=>this._blockRowHtml(s,a)).join("")}updateJsonFieldsList(){let e=document.querySelector(".json-fields-list");if(!e)return;let t=this.newRule.jsonFields||[];t.length===0?e.innerHTML='<div class="empty-hint">No JSON field modifications. Click "+ Add Field" to add one.</div>':e.innerHTML=t.map((s,a)=>`
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
				`}).join("");e.innerHTML=t}catch(e){console.error("Error updating modal pairs:",e)}}refreshModal(e){let t=document.querySelector(".modal-overlay");t&&t.remove(),document.body.insertAdjacentHTML("beforeend",this.getModal()),requestAnimationFrame(()=>{let s=document.querySelector(".modal-overlay");if(s&&(s.classList.add("show"),e)){let a=s.querySelector('input[name="title"]');a&&a.focus()}})}async toggleDefaultRules(){let e=document.querySelector(".default-rules-toggle");e&&(e.style.pointerEvents="none",e.style.opacity="0.7");try{if(this.state.defaultRulesEnabled){let t=await this.sendMessage({action:"clearDefaults"});t&&t.success&&(this.state.defaultRulesEnabled=!1,e&&e.classList.remove("active"),this.state.rules=this.state.rules.filter(s=>!s.isDefault),this.updateRulesDisplay())}else{let t=await this.sendMessage({action:"loadDefaults"});t&&t.success&&(this.state.defaultRulesEnabled=!0,e&&e.classList.add("active"),await this.refreshDataAndUpdateDisplay())}}finally{e&&(e.style.pointerEvents="",e.style.opacity="")}}async clearStats(){if(!confirm("Clear all statistics (including per-rule hit counters)?"))return;let e=await this.sendMessage({action:"clearStats"});e&&e.success&&await this.refreshDataAndUpdateDisplay()}async exportCustomRules(){try{let e=await this.sendMessage({action:"exportRules"});if(e&&e.success&&e.data){let t=e.data;if((t.rules?t.rules.length:0)===0){this.showErrorMessage("No custom rules to export");return}let a=JSON.stringify(t,null,2),i=new Blob([a],{type:"application/json"}),l=URL.createObjectURL(i),n=document.createElement("a");n.href=l;let c=new Date().toISOString().split("T")[0];n.download=`request-interceptor-rules-${c}.json`,document.body.appendChild(n),n.click(),document.body.removeChild(n),setTimeout(()=>URL.revokeObjectURL(l),1e3)}else this.showErrorMessage("Failed to export rules")}catch{this.showErrorMessage("Failed to export rules")}}async importCustomRules(e){try{let t=e.files[0];if(!t)return;let s=await t.text(),a;try{a=JSON.parse(s)}catch{this.showErrorMessage("Invalid JSON file"),e.value="";return}let i=await this.sendMessage({action:"importRules",data:a});if(i&&i.success){await this.refreshData();let l=`Imported ${i.imported||0} custom rule(s)`;i.duplicates&&(l+=` \u2014 ${i.duplicates} id collision(s) regenerated`),i.skipped&&(l+=` \u2014 ${i.skipped} skipped`),this.showSuccessMessage(l)}else i&&i.skipped!==void 0?this.showErrorMessage(`Nothing imported \u2014 ${i.skipped} rule(s) skipped (invalid or protected duplicates).`):this.showErrorMessage("Failed to import rules. Check file format.");e.value=""}catch(t){console.error("Error importing rules:",t),this.showErrorMessage("Failed to import rules")}}render(){let e=document.getElementById("root");this.state.loading?e.innerHTML=this.getLoadingSkeleton():e.innerHTML=this.getHTML()}getLoadingSkeleton(){return`
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
            <span class="stat-value">${this.state.stats.modifiedRequests??0}</span>
            <span class="stat-label">Modified</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${this.state.stats.urlModifications??0}</span>
            <span class="stat-label">URL</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${this.state.stats.postModifications??0}</span>
            <span class="stat-label">POST</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${this.state.stats.responseModifications??0}</span>
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
    `}_filterRules(e){let t=(this.state.ruleSearch||"").trim().toLowerCase();return t?e.filter(s=>(s.title||"").toLowerCase().indexOf(t)!==-1||(s.description||"").toLowerCase().indexOf(t)!==-1||(Array.isArray(s.urlMatch)?s.urlMatch.join(" "):s.urlMatch||"").toLowerCase().indexOf(t)!==-1?!0:(s.findReplacePairs||[]).some(i=>(i.find||"").toLowerCase().indexOf(t)!==-1||(i.replace||"").toLowerCase().indexOf(t)!==-1)):e}getRulesSection(){let e=this.state.rules.filter(s=>s.isDefault),t=this.state.rules.filter(s=>!s.isDefault);return`
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
    `}getDefaultRulesPanel(e){let t=this.state.categories||[],s=this.state.activeCategory||"all",a=`<button class="category-tab ${s==="all"?"active":""}" data-category="all" style="--tab-color:#888">All (${e.length})</button>`;for(let l of t){let n=e.filter(c=>c.category===l.id).length;n>0&&(a+=`<button class="category-tab ${s===l.id?"active":""}" data-category="${this.escapeHtml(l.id)}" style="--tab-color:${this.escapeHtml(l.color||"#888")}">${this.escapeHtml(l.name)} (${n})</button>`)}let i=this._filterRules(s==="all"?e:e.filter(l=>l.category===s));return`
      <div class="rules-panel-overlay" data-panel="default">
        <div class="rules-panel">
          <div class="panel-header-full">
            <h3>Default Rules</h3>
            <button class="btn btn-icon btn-secondary btn-close-panel" data-panel="default">\u2715</button>
          </div>
          <input type="text" class="rule-search-input form-input form-input-sm" style="margin:10px 14px 0" placeholder="Search rules..." value="${this.escapeHtml(this.state.ruleSearch||"")}">
          ${t.length>0?`<div class="category-tabs">${a}</div>`:""}
          <div class="panel-content">
            ${i.length>0?`
            <div class="rules-list-panel">
              ${i.map(l=>this.getCompactRuleItem(l)).join("")}
            </div>
            `:`
            <div class="empty-state-compact">
              <span class="empty-text">${this.state.ruleSearch&&this.state.ruleSearch.trim()?"No rules match your search":"No rules in this category"}</span>
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
          <input type="text" class="rule-search-input form-input form-input-sm" style="margin:10px 14px 0" placeholder="Search rules..." value="${this.escapeHtml(this.state.ruleSearch||"")}">
          <div class="panel-content">
            ${t.length>0?`
            <div class="rules-list-panel">
              ${t.map(s=>this.getRuleItem(s)).join("")}
            </div>
            `:`
            <div class="empty-state">
              <div class="empty-state-icon">${this.state.ruleSearch&&this.state.ruleSearch.trim()?"\u{1F50D}":"\u{1F4DD}"}</div>
              <div class="empty-state-text">${this.state.ruleSearch&&this.state.ruleSearch.trim()?"No rules match your search":"No custom rules configured"}</div>
              ${this.state.ruleSearch&&this.state.ruleSearch.trim()?"":'<button class="btn btn-primary btn-add-rule">Create your first rule</button>'}
            </div>
            `}
          </div>
        </div>
      </div>
    `}_getTargetTypeBadge(e){return{all:"ALL",post:"POST",url:"URL",response:"RESP",both:"BOTH",block:"BLOCK",headers:"HDR",jsonBody:"JSON",base64:"B64",mock:"MOCK",delay:"DELAY",inject:"INJECT"}[e]||""}_pairTargetOptions(e){return[["all","All (URL + POST + Response)"],["url","URL"],["post","POST Body"],["response","Response Body"],["both","Both (URL + POST)"],["jsonBody","JSON Body (Fields)"],["base64","Base64 Body"]].map(([s,a])=>`<option value="${s}" ${e===s?"selected":""}>${a}</option>`).join("")}_ruleTypeBadges(e){let t=[],s=new Set((e.findReplacePairs||[]).map(a=>a.targetType||e.targetType||"all"));if(s.forEach(a=>{let i=this._getTargetTypeBadge(a);i&&t.indexOf(i)===-1&&t.push(i)}),s.size===0){let a=this._getTargetTypeBadge(e.targetType);a&&t.push(a)}return t}getCompactRuleItem(e){if(e._protected){let n="";return e.description&&(n=`<span class="rule-compact-description">${this.escapeHtml(e.description)}</span>`),`
      <div class="rule-item-compact ${e.enabled?"enabled":"disabled"}">
        <div class="rule-compact-header">
          <div class="rule-toggle-small ${e.enabled?"active":""}" 
               data-rule-id="${e.id}" 
               title="${e.enabled?"Disable":"Enable"} rule">
            <div class="rule-toggle-small-thumb"></div>
          </div>
          <div class="rule-compact-info">
            <span class="rule-compact-title">\u{1F512} ${this.escapeHtml(e.title||"Protected Rule")}</span>
            ${n}
          </div>
          <button class="btn btn-icon btn-secondary btn-xs btn-duplicate-rule" data-rule-id="${e.id}" title="Duplicate as custom rule (open in block editor)">\u29C9 Duplicate</button>
        </div>
      </div>
    `}let t=this._ruleTypeBadges(e);e.findReplacePairs&&e.findReplacePairs.length>0&&e.findReplacePairs.some(n=>n.useRegex)&&t.push("REGEX");let a=(this.state.ruleStats||{})[e.title||"Untitled Rule"];a&&t.push("\u26A1"+a.hits),e.urlMatch&&(Array.isArray(e.urlMatch)?e.urlMatch.length>0:e.urlMatch.trim()!=="")&&t.push("MATCH");let l=t.join(" \u2022 ");return`
      <div class="rule-item-compact ${e.enabled?"enabled":"disabled"}">
        <div class="rule-compact-header">
          <div class="rule-toggle-small ${e.enabled?"active":""}" 
               data-rule-id="${e.id}" 
               title="${e.enabled?"Disable":"Enable"} rule">
            <div class="rule-toggle-small-thumb"></div>
          </div>
          <div class="rule-compact-info">
            <span class="rule-compact-title">${this.escapeHtml(e.title||"Untitled Rule")}</span>
            <span class="rule-compact-type">${l}</span>
          </div>
        </div>        ${e.description?`<div class="rule-compact-description">${this.escapeHtml(e.description)}</div>`:""}
      </div>
    `}getRuleItem(e){let t=e.title||"Untitled Rule",s=(this.state.ruleStats||{})[t],a=e.isDefault,i=e._protected,l="",n="",c=!1,o=0;e.findReplacePairs&&e.findReplacePairs.length>0&&(l=e.findReplacePairs[0].find,n=e.findReplacePairs[0].replace,c=e.findReplacePairs.some(g=>g.useRegex),o=e.findReplacePairs.length);let u=this._ruleTypeBadges(e);c&&u.push("REGEX"),e.urlMatch&&(Array.isArray(e.urlMatch)?e.urlMatch.length>0:e.urlMatch.trim()!=="")&&u.push("MATCH");let f=u.join(" \u2022 "),m=Array.isArray(e.urlMatch)?e.urlMatch.join(", "):e.urlMatch||"",v=o>1?` +${o-1} more`:"";return`
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
              <span class="rule-type-badge">${i?"\u{1F512} PROTECTED":f}</span>
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
            <code>${this.escapeHtml(l)}</code>
          </div>
          ${n?`
          <div class="pattern-row">
            <span class="pattern-label">REPL</span>
            <code>${this.escapeHtml(n)}</code>
          </div>
          `:""}
          ${v?`<div class="pattern-more">${v}</div>`:""}
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
          <span class="activity-count">${e.length} ${e.length===1?"entry":"entries"}</span>
        </div>
        <div class="activity-log-list">
          ${e.length>0?e.map(t=>this.getActivityEntry(t)).join(""):this.getActivityEmptyState()}
        </div>
      </div>
    `}getActivityEmptyState(){return'<div class="activity-empty">No activity yet \u2014 modifications will appear here in real time</div>'}getActivityEntry(e){let t={url:"URL",post:"POST",response:"RESP",block:"BLOCK",headers:"HDR"}[e.type]||(e.type?e.type.toUpperCase():"OTHER"),s={url:"url",post:"post",response:"response",block:"block",headers:"headers"}[e.type]||"",a=(e.rules||[]).join(", ")||"Unknown rule",i=this.formatTimeAgo(e.timestamp),l=e.url||"";return`
      <div class="activity-entry">
        <span class="activity-badge ${s}">${t}</span>
        <span class="activity-rules">${this.escapeHtml(a)}</span>
        ${l?`<span class="activity-url" title="${this.escapeHtml(l)}">${this.escapeHtml(l)}</span>`:""}
        <span class="activity-time">${i}</span>
      </div>
    `}formatTimeAgo(e){if(!e)return"just now";let t=Math.floor((Date.now()-e)/1e3);if(t<5)return"just now";if(t<60)return t+"s ago";let s=Math.floor(t/60);if(s<60)return s+"m ago";let a=Math.floor(s/60);return a<24?a+"h ago":Math.floor(a/24)+"d ago"}getModal(){let e=this.newRule.findReplacePairs.map((t,s)=>`
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
            <label class="form-checkbox" style="display:inline-flex; gap:8px; align-items:center; margin: 4px 0 12px;">
              <input type="checkbox" name="enabled" ${this.newRule.enabled!==!1?"checked":""} />
              <span>Rule enabled</span>
            </label>
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
            </div>
            ${this.newRule.targetType==="findReplace"||this.newRule.targetType==="jsonBody"||this.newRule.targetType==="headers"?`
            <div class="form-group blocks-group">
              <label class="form-label">Blocks <small style="font-size:11px;color:var(--text-muted)">(ordered actions \u2014 like OpenBullet, each block does one thing)</small></label>
              <div class="blocks-list">${(this.newRule.blocks||[]).map((t,s)=>this._blockRowHtml(t,s)).join("")||'<div class="empty-hint">No blocks yet. Click "+ Add Block" to add one.</div>'}</div>
              <button type="button" class="btn btn-secondary btn-sm btn-add-block mt-2">+ Add Block</button>
            </div>
            `:""}
            ${this.newRule.targetType==="findReplace"?`
            <div class="form-group find-replace-group" style="display:none;">
              <label class="form-label">Find & Replace Pairs (legacy)</label>
              <div class="find-replace-pairs-list">${e}</div>
              <button type="button" class="btn btn-secondary btn-sm btn-add-pair mt-2">+ Add Another Pair</button>
            </div>
            `:""}
            ${this.newRule.targetType==="jsonBody"?`<div style="display:none;">${this.getJsonFieldsEditor()}</div>`:""}
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
            ${this.newRule.targetType==="mock"?this.getHeaderRulesEditor():""}
            ${this.newRule.targetType==="findReplace"?`<div style="display:none;">${this.getHeaderRulesEditor()}</div>`:""}
            ${this.newRule.targetType==="findReplace"?`
            <div class="form-group url-params-group" style="display:none;">
              <label class="form-label">URL Parameters (legacy)</label>
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
		`}escapeHtml(e){try{if(e==null)return"";let t=document.createElement("div");return t.textContent=String(e),t.innerHTML.replace(/"/g,"&quot;")}catch(t){return console.error("Error escaping HTML:",t),""}}showSuccessAnimation(e){e&&(e.classList.add("success-animation"),setTimeout(()=>{e.classList.remove("success-animation")},600))}showSuccessMessage(e){try{document.querySelectorAll(".success-message, .error-message").forEach(s=>s.remove());let t=document.createElement("div");t.className="success-message",t.style.cssText="position:fixed; top:16px; left:50%; transform:translateX(-50%); background: var(--success, #28a745); color:white; padding:12px 20px; border-radius:6px; font-size:13px; z-index:3000; box-shadow:0 4px 12px rgba(0,0,0,.4); max-width:80vw;",t.textContent=e,document.body.appendChild(t),setTimeout(()=>{t.parentNode&&t.remove()},4e3)}catch(t){console.error("Error displaying success message:",t),console.log("Success:",e)}}showErrorMessage(e){try{document.querySelectorAll(".success-message, .error-message").forEach(s=>s.remove());let t=document.createElement("div");t.className="error-message",t.style.cssText="position:fixed; top:16px; left:50%; transform:translateX(-50%); background: var(--danger, #dc3545); color:white; padding:12px 20px; border-radius:6px; font-size:13px; z-index:3000; box-shadow:0 4px 12px rgba(0,0,0,.4); max-width:80vw;",t.textContent=e,document.body.appendChild(t),setTimeout(()=>{t.parentNode&&t.remove()},4e3)}catch{console.error("Extension error:",e)}}};document.addEventListener("DOMContentLoaded",()=>{let $=new w;window.addEventListener("beforeunload",()=>{$.cleanup()})});})();
