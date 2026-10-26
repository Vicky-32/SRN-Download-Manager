// Exercise the static site's UI behavior without a browser or network.
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const metadata=fs.readFileSync('dist/release.js','utf8');
const code=fs.readFileSync('dist/app.js','utf8');
class Element{
 constructor(dataset={}){this.dataset=dataset;this.attrs={};this.listeners={};this.href='#release-status';this.textContent='';this.classList={add:()=>{},remove:()=>{}};}
 setAttribute(name,value){this.attrs[name]=value;}
 addEventListener(name,callback){this.listeners[name]=callback;}
 click(){let prevented=false;this.listeners.click?.({preventDefault(){prevented=true;}});return prevented;}
 scrollIntoView(){this.scrolled=true;}
}
const theme=new Element(),toast=new Element(),status=new Element(),preview=new Element();
const previews=['dark','light'].map(value=>new Element({preview:value}));
const links=['windows','android','kit','extension','source','checksums'].map(value=>new Element({asset:value}));
const hashes=['windows','android'].map(value=>new Element({hash:value}));
const metas=['windows','android'].map(value=>new Element({meta:value}));
const document={documentElement:{dataset:{theme:'dark'}},querySelector:selector=>({'#toast':toast,'.theme-button':theme,'#release-status':status,'#app-preview':preview}[selector]),querySelectorAll:selector=>({'[data-preview]':previews,'.download-link':links,'[data-hash]':hashes,'[data-meta]':metas,'[data-version]':[]}[selector]||[])};
const context=vm.createContext({window:{},document,localStorage:{getItem:()=>null,setItem:()=>{}},navigator:{clipboard:{writeText:async()=>{}}},URL,setTimeout:()=>1,clearTimeout:()=>{}});
vm.runInContext(metadata,context);vm.runInContext(code,context);
theme.click();assert.equal(document.documentElement.dataset.theme,'light');
theme.click();assert.equal(document.documentElement.dataset.theme,'dark');
previews[1].click();assert.equal(preview.src,'assets/queue-light.png');assert.equal(previews[1].attrs['aria-pressed'],'true');assert.equal(previews[0].attrs['aria-pressed'],'false');
for(const link of links){assert.ok(link.href.startsWith(`https://github.com/Vicky-32/SRN-Download-Manager/releases/download/v${context.window.SRN_RELEASE.version}/`));assert.equal(link.click(),false);}
assert.ok(status.textContent.includes(`Version ${context.window.SRN_RELEASE.version}`));assert.ok(hashes.every(item=>!item.disabled));
context.window.SRN_RELEASE.assets.windows.url='https://example.com/unsafe.exe';vm.runInContext(code,context);assert.equal(links[0].click(),true);assert.equal(status.scrolled,true);
console.log('PASS: theme, screenshot switching, release link wiring, checksum availability and untrusted-link rejection');
