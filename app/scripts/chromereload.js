'use strict';

// This file allows changes in files to be immediately propagated to the
// chrome-loaded extension. Excitig times!
// TODO: probably remove this file once we roll out the extension
const filesInDirectory = dir => new Promise (resolve =>

    dir.createReader ().readEntries (entries =>

        Promise.all (entries.filter (e => e.name[0] !== '.').map (e =>

            e.isDirectory
                ? filesInDirectory (e)
                : new Promise (resolve => e.file (resolve))
        ))
        .then (files => [].concat (...files))
        .then (resolve)
    )
)

const timestampForFilesInDirectory = dir =>
        filesInDirectory (dir).then (files =>
            files.map (f => f.name + f.lastModifiedDate).join ())

const reload = () => {

    chrome.tabs.query ({ active: true, currentWindow: true }, tabs => { // NB: see https://github.com/xpl/crx-hotreload/issues/5

        if (tabs[0]) { chrome.tabs.reload (tabs[0].id) }

        chrome.runtime.reload ()
    })
}

const watchChanges = (dir, lastTimestamp) => {

    timestampForFilesInDirectory (dir).then (timestamp => {

        if (!lastTimestamp || (lastTimestamp === timestamp)) {

            setTimeout (() => watchChanges (dir, timestamp), 1000) // retry after 1s

        } else {

            reload ()
        }
    })

}

chrome.management.getSelf (self => {

    if (self.installType === 'development') {

        chrome.runtime.getPackageDirectoryEntry (dir => watchChanges (dir))
    }
})


// LEGACY CODE FROM SUMMARY EXTENSION
// Commented out code is from the original extension. Can't get liverload to work
// so changing code using this github repo (NEED TO CITE IT IN OUR README)
// https://github.com/xpl/crx-hotreload

// Reload client for Chrome Apps & Extensions.
// The reload client has a compatibility with livereload.
// WARNING: only supports reload command.
// var LIVERELOAD_HOST = 'localhost:';
// var LIVERELOAD_PORT = 35729;
// var connection = new WebSocket('ws://' + LIVERELOAD_HOST + LIVERELOAD_PORT + '/livereload');

// connection.onerror = function (error) {
//   console.log('reload connection got error:', error);
// };

// connection.onmessage = function (e) {
//   if (e.data) {
//     var data = JSON.parse(e.data);
//     if (data && data.command === 'reload') {
//       chrome.runtime.reload();
//     }
//   }
// };

// line that is the most important: chrome.runtime.reload();