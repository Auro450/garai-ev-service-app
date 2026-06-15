const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory() && file !== 'node_modules') {
      filelist = walkSync(dir + '/' + file, filelist);
    }
    else {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        filelist.push(dir + '/' + file);
      }
    }
  });
  return filelist;
};

const frontendFiles = walkSync('../frontend/src');
const adminFiles = walkSync('../admin/src');
const allFiles = [...frontendFiles, ...adminFiles];

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace template literal uses: `http://localhost:3000/something`
  content = content.replace(/`http:\/\/localhost:3000/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}");
  
  // Replace single quote uses: 'http://localhost:3000/something'
  content = content.replace(/'http:\/\/localhost:3000([^']*)'/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}$1`");

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
