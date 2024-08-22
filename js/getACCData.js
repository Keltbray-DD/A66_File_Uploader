

document.addEventListener('DOMContentLoaded', function() {
    loadingScreen = document.getElementById('loadingScreen');
    // Show the loading screen
    function showLoadingScreen() {
        loadingScreen.style.display = 'flex';
    }

    // Hide the loading screen
    async function hideLoadingScreen() {
        loadingScreen.style.display = 'none';
    }

    // Simulate gathering arrays with a delay
    async function gatherArrays() {

        showLoadingScreen(); // Show loading screen before gathering arrays
        await getfileslist()
        await getNamingStandard()
        await getTemplateFiles()
        getCustomDetailsData()
        populateClassificationDropdown(uniclassClassificationsArray)
        hideLoadingScreen();
 
    }
    gatherArrays();
})


  // Call the gatherArrays function


function generateDocName(){
    ProjectPin = document.querySelector('#ProjectPin_input')
    console.log(ProjectPin.value)
    Originator = document.querySelector("#Originator_input")
    console.log(Originator.value)
    vFunction = document.querySelector('#Function_input')
    console.log(vFunction.value)
    Spatial = document.querySelector("#Spatial_input")
    console.log(Spatial.value)
    Form = document.querySelector('#Form_input')
    console.log(Form.value)
    Discipline = document.querySelector("#Discipline_input")
    console.log(Discipline.value)
    const varDocNumber_noNum = ProjectPin.value+"-"+Originator.value+"-"+vFunction.value+"-"+Spatial.value+"-"+Form.value+"-"+Discipline.value
    console.log(varDocNumber_noNum)

    const PartialMatch = filelist.filter(item => item.includes(varDocNumber_noNum));

    if (PartialMatch.length >=1) {
        console.log(`Partial match '${varDocNumber_noNum}' found in the array.`);
        const partialMatchesArray = PartialMatch.map(match => match.replace(/\.[^.]+$/, ''));
        console.log('Partial matches array:', partialMatchesArray);

        // Extract the numbers from the filenames
        const numbers = partialMatchesArray.map(filename => {
            const match = filename.match(/(\d+)$/);
            return match ? parseInt(match[1], 10) : null;
        });

        // Find the maximum number
        const maxNumber = Math.max(...numbers);

        // Calculate the next number
        const nextNumber = maxNumber + 1;

        // Pad the next number with zeros and set the fixed length to 6
        const paddedNextNumber = String(nextNumber).padStart(6, '0');

        console.log('Next number with padded zeros and fixed length 6:', paddedNextNumber);

        newNumber = paddedNextNumber
    } else {
        console.log(`No partial match '${varDocNumber_noNum}' found in the array.`);
        newNumber = "000001"
    }

    const varDocNumber_Full = varDocNumber_noNum+"-"+newNumber
    console.log('New Document Number: ', varDocNumber_Full);
    sessionStorage.setItem('generatedName',varDocNumber_Full.toString())
    document.getElementById("DocNumber").value = varDocNumber_Full.toString()


    }

async function getTemplateFiles(){
    try {
        access_token = await getAccessToken("data:read");
    } catch {
        console.log("Error: Getting Access Token");
    }
    //console.log("Access Token: ", access_token);

    try {
        rawtemplatesList = await getfolderItems(templateFolderID,access_token,projectID)

    } catch (error) {
        console.error("Error iterating through searchFolders:", error);
    }
    console.log("Raw Template List",rawtemplatesList.data)
    // Filter objects with type 'Folder'
    templatesList = rawtemplatesList.data.filter(function(obj) {
        return obj.type === 'items';
    });
    console.log("Template List",templatesList)

    // Get the dropdown container
    const dropdownTemplateList = document.getElementById("input_file_template");

    // Create and append options to the dropdown
    templatesList.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.id;
        optionElement.textContent = option.attributes.displayName;
        dropdownTemplateList.appendChild(optionElement);

    });

    }

async function getNamingStandard() {
    try {
        access_token = await getAccessToken("data:read");
    } catch {
        console.log("Error: Getting Access Token");
    }
    //console.log("Access Token: ", access_token);

    try {
        namingstandard = await getNamingStandardforproject(access_token,namingstandardID,projectID)

    } catch (error) {
        console.error("Error iterating through searchFolders:", error);
    }
    arrayprojectPin = namingstandard.find(item => item.name === "Project PIN") // Change back to Project Pin
    arrayprojectPin = arrayprojectPin ? arrayprojectPin.options : [];

    // Get the dropdown container
    const dropdownContainerProjectPin = document.getElementById("ProjectPin_input");

    // Create and append options to the dropdown
    arrayprojectPin.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = `${option.value} - ${option.description}`;
        dropdownContainerProjectPin.appendChild(optionElement);
    });

    arrayOriginator = namingstandard.find(item => item.name === "Originator")
    arrayOriginator = arrayOriginator ? arrayOriginator.options : [];

    // Get the dropdown container
    const dropdownContainerOriginator = document.getElementById("Originator_input");

    // Create and append options to the dropdown
    arrayOriginator.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = `${option.value} - ${option.description}`;
        dropdownContainerOriginator.appendChild(optionElement);
    });

    arrayfunction = namingstandard.find(item => item.name === "Function")
    arrayfunction = arrayfunction ? arrayfunction.options : [];

    // Get the dropdown container
    const dropdownContainerfunction = document.getElementById("Function_input");

    // Create and append options to the dropdown
    arrayfunction.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = `${option.value} - ${option.description}`;
        dropdownContainerfunction.appendChild(optionElement);
    });

    arraySpatial = namingstandard.find(item => item.name === "Spatial")
    arraySpatial = arraySpatial ? arraySpatial.options : [];

    // Get the dropdown container
    const dropdownContainerSpatial = document.getElementById("Spatial_input");

    // Create and append options to the dropdown
    arraySpatial.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = `${option.value} - ${option.description}`;
        dropdownContainerSpatial.appendChild(optionElement);
    });

    arrayForm = namingstandard.find(item => item.name === "Form")
    arrayForm = arrayForm ? arrayForm.options : [];

    // Get the dropdown container
    const dropdownContainerForm = document.getElementById("Form_input");

    // Create and append options to the dropdown
    arrayForm.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = `${option.value} - ${option.description}`;
        dropdownContainerForm.appendChild(optionElement);
    });

    arrayDiscipline = namingstandard.find(item => item.name === "Discipline")
    arrayDiscipline = arrayDiscipline ? arrayDiscipline.options : [];

    // Get the dropdown container
    const dropdownContainerDiscipline = document.getElementById("Discipline_input");

    // Create and append options to the dropdown
    arrayDiscipline.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = `${option.value} - ${option.description}`;
        dropdownContainerDiscipline.appendChild(optionElement);
    });

    //console.log(namingstandard)
    console.log(arrayprojectPin)
    console.log(arrayOriginator)
    console.log(arrayfunction)
    console.log(arraySpatial)
    console.log(arrayForm)
    console.log(arrayDiscipline)
    }

async function getfileslist() {
    try {
        access_token = await getAccessToken("data:read");
    } catch {
        console.log("Error: Getting Access Token");
    }
    //console.log("Access Token: ", access_token);

    try {
        for (const folderID of searchFolders) {
            try {
                filelist_temp = await getfolderItems(folderID, access_token, projectID);

            } catch (error) {
                console.error("Error getting folder items:", error);
            }
            filelist = filelist.concat(filelist_temp.data.map(item => item.attributes.displayName))
        }

    } catch (error) {
        console.error("Error iterating through searchFolders:", error);
    }
    console.log(filelist)
    }

async function getAccessToken(scopeInput){

    const bodyData = {
        scope: scopeInput,
        };

    const headers = {
        'Content-Type':'application/json'
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyData)
    };

    const apiUrl = "https://prod-30.uksouth.logic.azure.com:443/workflows/df0aebc4d2324e98bcfa94699154481f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=jHsW0eISklveK7XAJcG0nhfEnffX62AP0mLqJrtLq9c";
    //console.log(apiUrl)
    //console.log(requestOptions)
    signedURLData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data

        //console.log(JSONdata)

        return JSONdata.access_token
        })
        .catch(error => console.error('Error fetching data:', error));


    return signedURLData
    }

async function generateTokenDataRead(clientId,clientSecret){
    const bodyData = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type:'client_credentials',
    scope:'data:read'
    };

    var formBody = [];
    for (var property in bodyData) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(bodyData[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    };
    formBody = formBody.join("&")

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: formBody,
    };
    const apiUrl = 'https://developer.api.autodesk.com/authentication/v1/authenticate';
    //console.log(requestOptions)
    AccessToken_Local = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
        //console.log(data)
        //console.log(data.access_token)
        return data.access_token
        })
        .catch(error => console.error('Error fetching data:', error));
        return AccessToken_Local
    }

async function getfolderItems(folder_id,AccessToken,project_id){

    const headers = {
        'Authorization':"Bearer "+AccessToken,
    };

    const requestOptions = {
        method: 'GET',
        headers: headers,
    };

    const apiUrl = "https://developer.api.autodesk.com/data/v1/projects/b."+project_id+"/folders/"+folder_id+"/contents";
    //console.log(apiUrl)
    //console.log(requestOptions)
    signedURLData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data
        //console.log(JSONdata)
        //console.log(JSONdata.uploadKey)
        //console.log(JSONdata.urls)
        return JSONdata
        })
        .catch(error => console.error('Error fetching data:', error));
    return signedURLData
    }

async function getItemsStorage(AccessToken){
    selectedItem = templateDropdown.value
    const headers = {
        'Authorization':"Bearer "+AccessToken,
    };

    const requestOptions = {
        method: 'GET',
        headers: headers,
    };

    const apiUrl = "https://developer.api.autodesk.com/data/v1/projects/b."+projectID+"/items/"+selectedItem;
    //console.log(apiUrl)
    //console.log(requestOptions)
    signedURLData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data
        //console.log(JSONdata)
        //console.log(JSONdata.uploadKey)
        //console.log(JSONdata.urls)
        return JSONdata
        })
        .catch(error => console.error('Error fetching data:', error));
    return signedURLData
    }

async function getItemStorageS3URL(AccessToken,itemURL){

    const headers = {
        'Authorization':"Bearer "+AccessToken,
    };

    const requestOptions = {
        method: 'GET',
        headers: headers,
    };

    const apiUrl = itemURL+"/signeds3download";
    //console.log(apiUrl)
    //console.log(requestOptions)
    signedURLData = await fetch(apiUrl,requestOptions)
    .then(response => {
        // Check if response is successful
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Return the response body as a Blob object
        return response.blob();
      })
      .then(fileBlob => {
        // Process the received file as a generic binary file
        console.log('Received file of type application/octet-stream');
        // Here, you can handle the binary file according to your needs
        // For example, you might want to save it to disk or display a download link
        // Below is just a sample of how you might handle it
        //const downloadUrl = URL.createObjectURL(fileBlob);
        //const downloadLink = document.createElement('a');
        //downloadLink.href = downloadUrl;
        //downloadLink.download = filename; // Set a default filename
        //downloadLink.textContent = 'Download file';
        //document.body.appendChild(downloadLink);
        fileTemplate = fileBlob
      })
      .catch(error => {
        console.error('Error:', error);
      });
        //.catch(error => console.error('Error fetching data:', error));
    return signedURLData
    }

async function downloadItem(downloadURL){
    
    const requestOptions = {
        method: 'GET',
    };

    const apiUrl = downloadURL;
    //console.log(apiUrl)
    //console.log(requestOptions)
    signedURLData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data
        //console.log(JSONdata)
        //console.log(JSONdata.uploadKey)
        //console.log(JSONdata.urls)
        return JSONdata
        })
        .catch(error => console.error('Error fetching data:', error));
    return signedURLData
    }

async function getNamingStandardforproject(access_token,ns_id,project_id){

    const headers = {
        'Authorization':"Bearer "+access_token,
    };

    const requestOptions = {
        method: 'GET',
        headers: headers,
    };

    const apiUrl = "https://developer.api.autodesk.com/bim360/docs/v1/projects/"+project_id+"/naming-standards/"+namingstandardID;
    //console.log(apiUrl)
    //console.log(requestOptions)
    responseData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data
        //console.log(JSONdata)
        //console.log(JSONdata.uploadKey)
        //console.log(JSONdata.urls)
        return JSONdata.definition.fields
        })
        .catch(error => console.error('Error fetching data:', error));
    return responseData
    }

    // Load the CSV file
    // JavaScript function to trigger the click event on the file input
    function openFileExplorer() {
        document.getElementById('fileInput').click();
    }

    function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    }

    function handleDrop(event) {
    event.preventDefault();
    var file = event.dataTransfer.files[0];
    handleFile(file);
    }

    function handleDragEnter(event) {
    event.preventDefault();
    document.getElementById('drop-area').classList.add('hover');
    }

    function handleDragLeave(event) {
    event.preventDefault();
    document.getElementById('drop-area').classList.remove('hover');
    }

    function handleFileSelect(event) {
    var file = event.target.files[0];
    handleFile(file);
    }

    function handleFile(file) {
    // Display file name
        const fileSizeInBytes = file.size;
        const fileSizeInKb = fileSizeInBytes / 1024;
        const fileSizeText = fileSizeInKb > 1024 ? (fileSizeInKb / 1024).toFixed(2) + ' MB' : fileSizeInKb.toFixed(2) + ' KB';
    document.getElementById('file-info').innerHTML = `<p>File: ${file.name}</p><p>Size: ${fileSizeText}</p>`;
    fileExtension = file.name.split('.').pop();
    // Add 'uploaded' class to indicate file upload
    document.getElementById('drop-area').classList.add('uploaded');
    
    }

// Function to populate dropdown with data
function populateClassificationDropdown(data) {
    const dropdown = document.getElementById('input_Classification');

    // Clear existing options
    dropdown.innerHTML = '';

    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.text = 'Select a classification';
    dropdown.add(defaultOption);

    // Add options for each item in the data array
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.code;
        option.text = item.code+" - "+item.title;
        dropdown.add(option);
    });
}