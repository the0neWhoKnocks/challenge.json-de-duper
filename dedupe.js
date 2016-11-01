'use strict';

var path = require('path');
var fs = require('fs');

const argsLength = Object.keys(process.argv).length - 2;
const availableFlags = ['--file', '-f'];
const acceptableFilesTypes = ['.json'];
let args = {};


process.argv.forEach((arg, index) => {
  // first two aren't args, so skip them
  if( index > 1 ){    
    // if the length is greater than 1, then there are flags
    if( argsLength > 1 ){
      // check for flags
      var flagNdx = availableFlags.indexOf(arg);
      
      if( flagNdx > -1 ){
        // assuming the flag value follows the flag in this case
        switch( availableFlags[flagNdx] ){
          case '--file' :
          case '-f' :
            args.file = process.argv[index+1];
            break;
        }
      }
    }
    // just a file was passed
    else{
      args.file = process.argv[index];
    }
  }
});

// start proccessing file
if( 
  args.file 
  && acceptableFilesTypes.indexOf(path.extname(args.file)) > -1
){
  console.log(`[PROCCESSING] "${args.file}"`);
  
  fs.readFile(args.file, 'utf8', (err, data) => {
    if (err) {
      console.log(`[ERROR] "${args.file}"`);
      process.exit(1);
    }
    
    let deDupedOutput = {};
    let dupedOutput = {};
    data = JSON.parse(data);
    
    Object.keys(data).forEach((key) => {
      const list = data[key];
      
      if( list.length ){
        let filteredById = {};
        let filteredByEmail = {};
        let deDuped = [];
        let dupes = [];
        
        list.forEach((currNode) => {
          // if there's a node with the same id, see if the current is newer
          if( filteredById[currNode._id] ){
            const dupe = filteredById[currNode._id];
            
            if( Date.parse(currNode.entryDate) >= Date.parse(filteredById[currNode._id].entryDate) ){
              dupes.push(dupe);
              console.log(`[DUPE] Id - ${JSON.stringify(dupe, null, 2)}`);
              
              filteredById[currNode._id] = currNode;
            }else{
              dupes.push(dupe);
              console.log(`[DUPE] Id - ${JSON.stringify(dupe, null, 2)}`);
            }
          }
          
          if( !filteredById[currNode._id] ){
            filteredById[currNode._id] = currNode;
          }
        });
        
        // check if there's a duplicate email
        Object.keys(filteredById).forEach((key) => {
          const currNode = filteredById[key];
          
          // if there's a node with the same email, see if the current is newer
          if( filteredByEmail[currNode.email] ){
            const dupe = filteredByEmail[currNode.email];
            
            if( Date.parse(currNode.entryDate) >= Date.parse(filteredByEmail[currNode.email].entryDate) ){
              dupes.push(dupe);
              console.log(`[DUPE] Email - ${JSON.stringify(dupe, null, 2)}`);
              
              filteredByEmail[currNode.email] = currNode;
            }else{
              dupes.push(dupe);
              console.log(`[DUPE] Email - ${JSON.stringify(dupe, null, 2)}`);
            }
          }
          
          if( !filteredByEmail[currNode.email] ){
            filteredByEmail[currNode.email] = currNode;
          }
        });
        
        // combine the de-duped now that everything's filtered
        Object.keys(filteredByEmail).forEach((key) => {
          const currNode = filteredByEmail[key];
          
          deDuped.push(currNode);
        });
        
        deDupedOutput[key] = deDuped;
        dupedOutput[key] = dupes;
      }
    });
    
    // output a file with the results
    const origName = path.basename(args.file, '.json');
    const filename = './'+ origName +'_output.html';
    let fileContents = `
      <html>
        <head>
          <title>${origName} Output</title>
        </head>
        <body>
          <h2>De-Duped</h2>
          <pre>${JSON.stringify(deDupedOutput, null, 2)}</pre>
          <hr>
          <h2>Dupes</h2>
          <pre>${JSON.stringify(dupedOutput, null, 2)}</pre>
        </body>
      </html>
    `;
    
    fs.writeFile(filename, fileContents, 'utf8', (err) => {
      if( err ){
        console.log(`[ERROR] Couldn't write file ${filename}`);
        process.exit(1);
      }
      
      console.log(`[SUCCESS]`);
    });
  });
}else{
  console.log('[ERROR] File not provided');
  process.exit(1);
}