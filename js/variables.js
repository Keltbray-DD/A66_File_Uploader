const projectID = "76c59b97-feaf-413c-9bd0-43cf8aaa3133";
const hubID = "b.24d2d632-e01b-4ca0-b988-385be827cb04";
const bucketKey = "wip.dm.emea.2";
const toolURL ="https://keltbray-dd.github.io/A66_File_Uploader/"
//const toolURL = "http://127.0.0.1:3002/index.html";

let ProjectFiles = [];
let projectFolders;
let deliverableFolders = [];

const StatesList = [
  { code: "A4", description: "Accepted Design", folder: "PUBLISHED" },
  { code: "A5", description: "Accepted For Construction", folder: "PUBLISHED" },
  { code: "A6", description: "Accepted Handover", folder: "PUBLISHED" },
  {
    code: "A7",
    description: "Accepted Operation and Maintain",
    folder: "PUBLISHED",
  },
  { code: "S0", description: "Work In Progress", folder: "WIP" },
  { code: "S1", description: "Suitable For Co-Ordination", folder: "SHARED" },
  { code: "S2", description: "Suitable For Information", folder: "SHARED" },
  { code: "S3", description: "Suitable Review & Comment", folder: "SHARED" },
  {
    code: "S4",
    description: "Suitable Lead Appointed Party Approval",
    folder: "CLIENT_SHARED",
  },
  { code: "S6", description: "Suitable PIM Authorisation", folder: "NA" },
  { code: "S7", description: "Suitable AIM Authorisation", folder: "NA" },
];

const tooltips = [
  {
    value: "Project Pin",
    tooltip:
      "The ‘project pin’ identifier code indicates that a document is related to a specific project to control its placement and management within the project folder structure where more than one project identification number may be in use",
  },
  {
    value: "Originator",
    tooltip:
      "The ‘originator’ (company) identifier code serves to identify which company has created a document. They are ultimately accountable for the document and liable for its content through the lifecycle of the project",
  },
  {
    value: "Function",
    tooltip:
      "The ‘function’ (volume) identifier code clearly defines the required profession to allow the user to better understand the documents relevance without having to open it",
  },
  {
    value: "Spatial",
    tooltip:
      "The ‘spatial’ (location) identifier code provides the user with a clear location the document content relates to. This code can be used to understand for instance if the document relates to a site compound, battery island or junction",
  },
  {
    value: "Form",
    tooltip:
      "The ‘form’ (type) identifier code indicates to the user the type of document it is, for example a report (RP), a drawing (DR) or 2D Model (M2)",
  },
  {
    value: "Discipline",
    tooltip:
      "The ‘discipline’ (Task Team) identifier code gives a user information on who the responsible team/discipline is, who have generated the document’ content and are accountable for it",
  },
  {
    value: "uploadfolder",
    tooltip:
      "The system automatically uses the originator code to determine your files destination on ACC to (i.e. if KEL is the originator code you file will upload to WIP>KEL folder)",
  },
  {
    value: "title",
    tooltip:
      "Add title information that directly matches what you have used on the file cover sheet or drawing frame.",
  },
  {
    value: "description",
    tooltip:
      "Add a description of what the files’ purpose is to aid anyone searching for your file to understand what it may contain. The description should not match the title information. It should be unique but related to the file.",
  },
  {
    value: "classification",
    tooltip:
      "You are required to assign a classification code to your file to accord to ISO 19650. This is assigned automatically based of the function and form codes you have selected in step 1",
  },
  {
    value: "series",
    tooltip:
      "Add the series that your file relates to, to assist in searchability and collation of similar files as required. If a series is not applicable to your file, select this form the list.",
  },
  {
    value: "uploadfile",
    tooltip:
      "The 'Template folder' function lets you create a new file from templates like Word, Excel, or AutoCAD. It's useful with a TIDP. If no template is available, contact your Information Manager or Document Controller.The 'Your computer' function lets you upload a file from outside the CDE. You can either click to open a file dialog or drag and drop the file into the designated area.",
  },
  {
    value: "uploadButton",
    tooltip:
      "Click the 'Upload file to ACC' button to apply the inputs and complete the task. Once uploaded, you'll see a confirmation message: 'File uploaded successfully.' You can then view the file, close the tool, or upload another. Tip: Bookmark the uploader link or save a shortcut for future use, Press Ctrl+D (Windows) or Command+D (Mac) to bookmark this page.",
  },
];

var AccessToken_DataCreate;
var AccessToken_DataRead;
var AccessToken_BucketCreate;

let filelist = [];
let arrayprojectPin = [];
let arrayOriginator = [];
let arrayfunction = [];
let arraySpatial = [];
let arrayForm = [];
let arrayDiscipline = [];
let customAttributes = [];
let templatesList = [];
let filteredClassification = [];

let objectKeyShort;
let objectKeyLong;
let fileData;
let filename;
let droppedfile;
let uploadfile;

let titlelineID;
let revisionCodeID;
let revisionDescID;
let statusCodeID;
let ClassificationID;
let StatusCodeDescriptionID;
let FileDescriptionID;
let StateID;
let SeriesID;
let namingstandardID;

let namingstandard;
let fileURN;
let fileExtension;
let maxChars = 80;
let progressCount = 0;
let uploadbutton;
let originSelectionDropdown;
let templateDropdwon;
let copyURN;
let copyURN_Raw;
let uploadFolderID;
let fileTemplate;
let reloadButton;
let loadingScreen;
let selectedOriginator;
let selectedFunction;
let selectedForm;
let codeParam;
let userAccessToken;
let userDetails;
let userProjectDetails;
let userProjectRoles;
let userCompany;
let isAdmin;

document.addEventListener("DOMContentLoaded", function () {
  uploadbutton = document.getElementById("viewfile_btn");
  originSelectionDropdown = document.getElementById("input_file_origin");
  droparea = document.getElementById("drop-area");
  templateDropdwon = document.getElementById("templatesDropdown");
  reloadButton = document.getElementById("reloadButton");
  tooltip = document.getElementById("tooltip");
  tooltipQuestion = document.querySelectorAll(".fa-circle-question");

  // Add a click event listener to the button
  reloadButton.addEventListener("click", function () {
    // Reload the page
    location.reload();
    // Scroll to the top of the page
    window.scrollTo(0, 0);
  });

  originSelectionDropdown.addEventListener("change", function () {
    // This function will be called whenever the dropdown value changes
    templateDropdwon.style.display = "none";
    droparea.style.display = "none";
    //console.log('Selected option:', originSelectionDropdown.value);
    // You can perform any actions you need here
    if (originSelectionDropdown.value === "Template Folder") {
      templateDropdwon.style.display = "block";
    } else if (originSelectionDropdown.value === "Your computer") {
      droparea.style.display = "block";
    }
  });
  // Add event listener to each help icon
  tooltipQuestion.forEach(function (icon) {
    icon.addEventListener("click", function () {
      var index = this.getAttribute("value");
      displayMessage = lookupTooltip(index, tooltips);
      alert(displayMessage);
    });
  });

  function lookupTooltip(valueToFind, array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].value === valueToFind) {
        return array[i].tooltip;
      }
    }
    return "Tooltip not found"; // Return a default message if the value is not found
  }

  // Get all toggle buttons
  const toggleHeaders = document.querySelectorAll(".toggle-header");

  // Add a click event listener to each button
  toggleHeaders.forEach((button) => {
    button.addEventListener("click", function () {
      // Get the target section id from the data attribute
      const targetSectionId = this.getAttribute("data-target");
      const targetSection = document.getElementById(targetSectionId);
      const arrow = this.querySelector(".arrow");

      // Toggle the section's visibility
      targetSection.classList.toggle("hidden");

      // Change the arrow direction based on visibility
      if (targetSection.classList.contains("hidden")) {
        arrow.classList.remove("down");
        arrow.classList.add("right");
      } else {
        arrow.classList.remove("right");
        arrow.classList.add("down");
      }
    });
  });
  // Function to handle character counting and limiting for a given textarea
  function handleInput(event) {
    const textInput = event.target;
    const currentText = textInput.value.replace(/\s/g, "");
    const charCount = textInput.nextElementSibling.querySelector(".charCount"); // the p.charCount in the same container
    const error = textInput.nextElementSibling.querySelector(".error"); // the p.error in the same container

    // Update character count (excluding spaces)
    charCount.textContent = `${currentText.length}/${maxChars} characters`;

    // Check if character count exceeds or equals the limit
    if (currentText.length >= maxChars) {
      error.style.display = "block";

      // Get the input value without trimming it, only limit typing by disabling additional characters
      let truncatedText = textInput.value
        .split("")
        .filter((c) => c !== " ")
        .join("")
        .slice(0, maxChars);

      // Reconstruct the string with spaces at the same positions, but with the limited character count
      let finalText = "";
      let nonSpaceIndex = 0;
      for (let i = 0; i < textInput.value.length; i++) {
        if (textInput.value[i] === " ") {
          finalText += " "; // Add spaces in the original positions
        } else if (nonSpaceIndex < truncatedText.length) {
          finalText += truncatedText[nonSpaceIndex];
          nonSpaceIndex++;
        }
      }

      // Set the value back into the textarea
      textInput.value = finalText;
    } else {
      error.style.display = "none";
    }
  }

  // Attach event listeners to all text areas with the class "textInput"
  const textInputs = document.querySelectorAll(".textInput");
  textInputs.forEach((input) => {
    input.addEventListener("input", handleInput);
  });
});

async function setToolMode() {
  const rolesToCheck = [
    "System Administrator",
    "Document Controller",
    "Information Manager",
  ];

  // Check if any roles in rolesToCheck are present in userProjectRoles
  isAdmin = rolesToCheck.some((role) =>
    userProjectRoles.some((userRole) => userRole.name === role)
  );

  if (isAdmin) {
    activateAdminMode();
  }

  function activateAdminMode() {
    document.getElementById("Originator_input").disabled = false;
    document.getElementById("input_folder").disabled = false;
    document.getElementById("input_Status").disabled = false;

    console.log("Admin mode activated");
  }
}

async function getUserDetailsFill() {
  await getUserDetails();
  access_token = await getAccessToken("account:read");
  userID = userDetails.sub;

  await getUserProjectDetails(access_token, userID);
  setUserInfo(userProjectDetails);
  userCompany = userProjectDetails.companyName;
  console.log(userCompany);
  console.log("userProjectRoles", userProjectRoles);
  await setToolMode();
}
async function setUserInfo(data) {
  const profilePic = document.getElementById("userPicture");
  const profileName = document.getElementById("userName");
  const profileEmail = document.getElementById("userEmail");
  if (data.imageUrl) {
    profilePic.src = data.imageUrl;
  } else {
    console.error("Image URL is undefined");
  }
  profileName.textContent = data.name;
  profileEmail.textContent = data.email;
}

async function getUserProjectDetails(accessToken, userId) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`, // Make sure this is securely handled
  };
  const requestOptions = {
    method: "GET",
    headers: headers,
  };
  const apiUrl = `https://developer.api.autodesk.com/construction/admin/v1/projects/${projectID}/users/${userId}`;
  response = await fetch(apiUrl, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      userProjectDetails = data;
      userProjectRoles = data.roles;
      return data;
    })
    .catch((error) => console.error("Error fetching data:", error));
  return response;
}
async function getUserDetails() {
  const headers = {
    "Content-Type": "application/json",
    Authorization: userAccessToken, // Make sure this is securely handled
  };
  const requestOptions = {
    method: "GET",
    headers: headers,
  };
  const apiUrl = "https://api.userprofile.autodesk.com/userinfo";
  response = await fetch(apiUrl, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      userDetails = data;
      return data;
    })
    .catch((error) => console.error("Error fetching data:", error));
  return response;
}
window.onload = function () {
  function signin() {
    window.open(
      "https://developer.api.autodesk.com/authentication/v2/authorize?response_type=code&client_id=UMPIoFc8iQoJ2eKS6GsJbCGSmMb4s1PY&redirect_uri=" +
        toolURL +
        "&scope=data:read data:write data:create&prompt=login&state=12321321",
      "_self"
    );
  }

  // Function to parse URL parameters
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  // Function to clear URL parameters (after reload or after successful fetch)
  function clearUrlParameters() {
    // Replace the current URL without reloading the page, and remove query parameters
    const cleanUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname;
    window.history.replaceState({ path: cleanUrl }, "", cleanUrl);
  }

  async function getAuthorisation(code) {
    const bodyData = {
      code: code,
      grant_type: "authorization_code",
      redirect_uri: toolURL,
    };

    let formBody = [];
    for (let property in bodyData) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(bodyData[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic VU1QSW9GYzhpUW9KMmVLUzZHc0piQ0dTbU1iNHMxUFk6M1ZQMUdyekxMdk9Vb0V6dQ==", // Make sure this is securely handled
    };

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: formBody,
    };

    const apiUrl = "https://developer.api.autodesk.com/authentication/v2/token";
    AccessToken_Local = await fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error === "invalid_grant") {
          // If there's an error, reload the page
          clearUrlParameters();
          location.reload();
        } else {
          console.log(data);
          userAccessToken = data.access_token;
          console.log("userAccessToken", userAccessToken);
          // Clear the URL parameters once the token is retrieved successfully
          getUserDetailsFill();
        }
        return data;
      })
      .catch((error) => console.error("Error fetching data:", error));
    return AccessToken_Local;
  }

  // Check if 'code' parameter exists in the URL
  var codeParam = getParameterByName("code");
  if (codeParam !== null) {
    console.log("Code parameter found: " + codeParam);
    // Call the function to handle authorization
    getAuthorisation(codeParam);
  } else {
    signin();
  }
};
