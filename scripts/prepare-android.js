// Runs after `npx cap add android`: copies icons/resources and adds the permissions the app needs.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const resSrc = path.join(root, 'assets', 'res');
const resDst = path.join(root, 'android', 'app', 'src', 'main', 'res');

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}
copyDir(resSrc, resDst);

const mf = path.join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
let x = fs.readFileSync(mf, 'utf8');
const perms = [
  'android.permission.VIBRATE',
  'android.permission.USE_EXACT_ALARM',
  'android.permission.SCHEDULE_EXACT_ALARM',
  'android.permission.POST_NOTIFICATIONS',
  'android.permission.RECEIVE_BOOT_COMPLETED',
  'android.permission.WAKE_LOCK',
];
let add = '';
for (const p of perms) if (!x.includes(p)) add += `    <uses-permission android:name="${p}" />\n`;
if (add) x = x.replace('</manifest>', add + '</manifest>');
fs.writeFileSync(mf, x);
console.log('prepare-android: resources copied, permissions ensured');
