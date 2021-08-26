// set variables
const apiUrl = "<HttpApiUrl goes here>" //update with value from HttpApiUrl output from Cloudformation Stack
const uploadBucket = "<S3UploadBucketName goes here>" //update with value from S3UploadBucketName outpost from Cloudformation Stack

// get the filename of the file to upload and set the custom file label field
function getFileName(fileName) {
	var name = fileName.files.item(0).name
	document.getElementById('custom-file-label').innerHTML = name;
}

// get the presigned upload url
// upload the file
// submit the job
function startJob() {
	var name = document.getElementById('file').files[0].name;
	loadingStart();
	getUploadUrl(name);
}

// call the get upload api to get the 
// presigned put url to upload the file then
// upload the file
function getUploadUrl(fileName) {
	var request = new XMLHttpRequest();
	var params = "filename=" + fileName;

	request.open("GET", apiUrl + "/upload?" + params);
	request.setRequestHeader("Accept", "*/*");
	request.setRequestHeader("authorization", "superSecret");
	request.setRequestHeader("Access-Control-Allow-Origin", "*");
	request.send();

	request.onload = function () {
		var data = JSON.parse(this.response);
		if (request.status >= 200 && request.status < 400) {
			uploadFile(data);
		} else {
			console.log("error");
		}
	};
}


// upload the video file
function uploadFile(data) {
	const file = document.getElementById('file').files[0]
	const uploadUrl = data.url;
	const formData = new FormData();

	for (key in data.fields) {
		formData.append(key, data.fields[key])
	}

	formData.append('file', file);

	var request = new XMLHttpRequest();
	request.open("POST", uploadUrl, true);
	request.send(formData);

	request.onload = function () {
		console.log(this.response);
		if (request.status >= 200 && request.status < 400) {
			submitJob()
		} else {
			console.log("error");
		}
	};
}

// create the input json and call the api endpoint to start the translate job
function submitJob() {
	var filename = document.getElementById('file').files[0].name;
	var jobForm = document.getElementById("jobParams");
	var source = document.getElementById("source");
	var sourceLang = source.value.split('|');
	var sourceShort = sourceLang[0]; 
	var sourceLong = sourceLang[1];
	var checkedLangs = []
	var subtitles = document.getElementsByName('subtitle')
	var polly = document.getElementsByName('polly')

	var json = {
		"Inputs": {
			"inputMediaBucket": uploadBucket,
			"inputMediaKey": filename,
			"mediaFile": filename,
			"mediaFormat": "mp4",

			"sourceLanguageShort": sourceShort,
			"sourceLanguageFull": sourceLong
		},
		"Targets": []
	}
	
	checkedLangs.push(sourceShort);
	for (var i = 0; i < subtitles.length; i++){
		if (subtitles[i].checked){
			checkedLangs.push(subtitles[i].value.split('|')[0])
		}
	}
	for (var i = 0; i < polly.length; i++){
		if (polly[i].checked){
			checkedLangs.push(polly[i].value.split('|')[0])
		}
	}
	checkedLangs = [...new Set(checkedLangs)]

	for (var i = 0; i < checkedLangs.length; i++){
		
		var translate_yn='y', subtitle_yn='n', polly_yn='n'
		var targetLangShort = checkedLangs[i]
		var targetLangFull = document.getElementById('subtitle_'.concat(checkedLangs[i])).value.split('|')[1]
		var targetVoice = document.getElementById('polly_'.concat(checkedLangs[i])).value.split('|')[2]

		if(document.getElementById('subtitle_'.concat(checkedLangs[i])).checked){
			subtitle_yn='y'
		}
		if(document.getElementById('polly_'.concat(checkedLangs[i])).checked){
			polly_yn='y'
		}
		if(document.getElementById('source').value.split('|')[0]==checkedLangs[i]){
			translate_yn='n'
		}
		target = {
			"translate": {
				"translate": translate_yn,
				"targetLanguageShort": targetLangShort,
				"targetLanguageFull": targetLangFull,
			},
			"subtitle": {
				"createSubtitle": subtitle_yn,
				"subtitleType": "srt"
			},
			"polly": {
				"createAudio": polly_yn,
				"voiceId": targetVoice,
			}
		}
		json.Targets.push(target)
	}

	var request = new XMLHttpRequest();
	request.open("POST", apiUrl + "/job");

	request.setRequestHeader("Accept", "*/*");
	request.setRequestHeader("Access-Control-Allow-Origin", "*");
	request.setRequestHeader("Authorization", "");
	request.setRequestHeader('Content-Type', 'application/json');

	request.send(JSON.stringify(json));

	console.log(json);

	request.onload = function () {
		var data = JSON.parse(this.response);
		if (request.status >= 200 && request.status < 400) {
			resetForm()
		} else {
			console.log("error");
		}
	};
	jobForm.reset()
}


// disabled the polly track for the source language selected
function sourceOptions(){
	var subtitles = document.getElementsByName('subtitle')
	var polly = document.getElementsByName('polly')
	
	for (var i = 0; i < subtitles.length; i++){
		// subtitles[i].disabled=false
		if(subtitles[i].disabled){
			subtitles[i].checked=false
			subtitles[i].disabled=false
		}
		if(document.getElementById('source').value.split('|')[0]==subtitles[i].value.split('|')[0]){
			subtitles[i].checked=true
			subtitles[i].disabled=true
		}
	}
	for (var i = 0; i < polly.length; i++){
		polly[i].disabled=false
		if(document.getElementById('source').value.split('|')[0]==polly[i].value.split('|')[0]){
			polly[i].checked=false
			polly[i].disabled=true
		}
	}

}

// reset the page
function resetForm() {
	document.getElementById('custom-file-label').innerHTML = "Choose file";
	document.getElementById("jobParams").reset();
	sourceOptions();
	setTimeout(function(){
		getJobList();
	},3000);
	loadingStop();
	

}

// refresh job list every 60 seconds
var timer = setInterval(getJobList, 60000);

// get the list of jobs and their status
function getJobList() {
	document.getElementById("jobList").innerHTML = "Loading...";

	var request = new XMLHttpRequest();
	request.open("GET", apiUrl + "/job");


	request.setRequestHeader("Accept", "*/*");
	request.setRequestHeader("Access-Control-Allow-Origin", "*");
	request.setRequestHeader("Authorization", "");
	request.setRequestHeader('Content-Type', 'application/json');

	request.send();

	request.onload = function () {
		var data = JSON.parse(this.response);
		if (request.status >= 200 && request.status < 400) {
			var html = `<table class="table">
    <thead>
      <tr>
        <th scope="col">Job ID</th>
        <th scope="col">Job Status</th>
        <th scope="col">Filename</th>
        <th scope="col">Launch Video</th>
      </tr>
    </thead>
    <tbody>`

			for (var i in data.data) {

				html += `<tr>
        <th scope="row">` + data.data[i].jobId + `</th>
        <td>` + data.data[i].jobStatus + `</td>
        <td>` + data.data[i].fileName + `</td>`
				if (data.data[i].jobStatus === 'COMPLETED') {
					html += `<td><a href="javascript:launchVideo('` + data.data[i].playbackUrl + `');">Launch Video</a></td>`
				} else {
					html += `<td>Video Not Available</td>`
				}

			}
			html += `</tbody>
      </table>`
			document.getElementById("jobList").innerHTML = html;

		} else {
			console.log("error");
		}
	};

};

function launchVideo(url) {

	window.open(
		'/player.html?url=' + url,
		'_blank'
	);

};


// get source url for video player

function getParameterByName(name, url = window.location.href) {
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


function loadingStart() {
	var btn = document.getElementById('btnSubmit')
	var loading = document.getElementById('btnLoading')
	var btnText = document.getElementById('btnText')
	btnText.innerText = ' Loading... '
	loading.style.display = '';
	btn.disabled = true
}

function loadingStop() {
	var btn = document.getElementById('btnSubmit')
	var loading = document.getElementById('btnLoading')
	var btnText = document.getElementById('btnText')
	btnText.innerText = ' Submit Job '
	loading.style.display = 'none';
	btn.disabled = false
}