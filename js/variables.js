const projectID = "76c59b97-feaf-413c-9bd0-43cf8aaa3133";
const namingstandardID ="bfb5fb2c-2fdd-57e1-a0df-f67ca9c0dfc6"
const hubID= "b.24d2d632-e01b-4ca0-b988-385be827cb04"
const bucketKey = "wip.dm.emea.2"
const defaultFolder = "urn:adsk.wipemea:fs.folder:co.URthp3nyQJSVkS_ixq1kLw" // KELTBRAY - WIP Folder
const templateFolderID = "urn:adsk.wipemea:fs.folder:co.XZyMaargRi6mOFkOPeU-xA" // APPROVED_TEMPLATES Folder

const uploadfolders = [
    {folderName:"KELTBRAY - WIP",folderID:"urn:adsk.wipemea:fs.folder:co.URthp3nyQJSVkS_ixq1kLw"},
    //{folderName:"SHARED",folderID:"urn:adsk.wipemea:fs.folder:co.mRskcAmVS420xLXVgxF8ZA"}
]

const StatesList = [
    { code: 'A4', description: 'Accepted Design',folder:"PUBLISHED" },
    { code: 'A5', description: 'Accepted For Construction',folder:"PUBLISHED" },
    { code: 'A6', description: 'Accepted Handover',folder:"PUBLISHED" },
    { code: 'A7', description: 'Accepted Operation and Maintain',folder:"PUBLISHED" },
    { code: 'S0', description: 'Work in Progress',folder:"WIP" },
    { code: 'S1', description: 'Suitable For Co-Ordination',folder:"SHARED" },
    { code: 'S2', description: 'Suitable For Information',folder:"SHARED" },
    { code: 'S3', description: 'Suitable Review & Comment',folder:"SHARED" },
    { code: 'S4', description: 'Suitable LeadAppointedPartyApproval',folder:"CLIENT_SHARED" },
    { code: 'S6', description: 'Suitable PIM Authorisation',folder:"NA" },
    { code: 'S7', description: 'Suitable AIM Authorisation',folder:"NA" }
];

const searchFolders =[
    "urn:adsk.wipemea:fs.folder:co.URthp3nyQJSVkS_ixq1kLw", // 0C.KELTBRAY - WIP
    "urn:adsk.wipemea:fs.folder:co.jA228qR9T2Of7j3Z6Mmpwg", // 0D.SUB-CONTRACTORs - JACOBS - WIP
    "urn:adsk.wipemea:fs.folder:co.XUG4NnuhQhitF0EJV3Ta4A", // 0D.SUB-CONTRACTORs - WENTWORTH HOUSE - WIP
    "urn:adsk.wipemea:fs.folder:co.Ru81Mqr4Qk6NXn4odgar3w", // 0E.SHARED
    "urn:adsk.wipemea:fs.folder:co.YASk96dnSEKD4yiEFsgx6g", // 0F.CLIENT_SHARED
    "urn:adsk.wipemea:fs.folder:co.q64hLwHiQPm04oCvl0PX0g", // 0G.PUBLISHED
    "urn:adsk.wipemea:fs.folder:co.4BeOE7NxR5aqMWBDSaccxA", // 0H.ARCHIVED
]

const tooltips = [
    { value: "Project Pin", tooltip: "The ‘project pin’ identifier code indicates that a document is related to a specific project to control its placement and management within the project folder structure where more than one project identification number may be in use" },
    { value: "Originator", tooltip: "The ‘originator’ (company) identifier code serves to identify which company has created a document. They are ultimately accountable for the document and liable for its content through the lifecycle of the project" },
    { value: "Function", tooltip: "The ‘function’ (volume) identifier code clearly defines the required profession to allow the user to better understand the documents relevance without having to open it" },
    { value: "Spatial", tooltip: "The ‘spatial’ (location) identifier code provides the user with a clear location the document content relates to. This code can be used to understand for instance if the document relates to a site compound, battery island or junction" },
    { value: "Form", tooltip: "The ‘form’ (type) identifier code indicates to the user the type of document it is, for example a report (RP), a drawing (DR) or 2D Model (M2)" },
    { value: "Discipline", tooltip: "The ‘discipline’ (Task Team) identifier code gives a user information on who the responsible team/discipline is, who have generated the document’ content and are accountable for it" }
];

var AccessToken_DataCreate
var AccessToken_DataRead
var AccessToken_BucketCreate

let namingstandard;
let filelist =[];
let arrayprojectPin=[];
let arrayOriginator=[];
let arrayfunction=[];
let arraySpatial=[];
let arrayForm=[];
let arrayDiscipline=[];
let objectKeyShort
let objectKeyLong
let fileData
let filename
let customAttributes =[]
let templates = []

let titlelineID
let revisionCodeID
let revisionDescID
let statusCodeID
let ClassificationID
let StatusCodeDescriptionID
let FileDescriptionID
let StateID

let fileURN
let fileExtension
let progressCount = 0
let uploadbutton
let templatesList =[];
let originSelectionDropdown
let templateDropdwon
let copyURN
let copyURN_Raw
let uploadFolderID
let fileTemplate
let reloadButton
let loadingScreen

document.addEventListener('DOMContentLoaded', function() {
    uploadbutton = document.getElementById('viewfile_btn');
    originSelectionDropdown = document.getElementById('input_file_origin');
    droparea = document.getElementById('drop-area')
    templateDropdwon = document.getElementById('templatesDropdown');
    reloadButton = document.getElementById('reloadButton');
    tooltipQuestion = document.querySelectorAll('.fa-circle-question')

    // Add a click event listener to the button
    reloadButton.addEventListener('click', function() {
        // Reload the page
        location.reload();
        // Scroll to the top of the page
        window.scrollTo(0, 0);
    });

    originSelectionDropdown.addEventListener('change', function() {
        // This function will be called whenever the dropdown value changes
        templateDropdwon.style.display = 'none'
        droparea.style.display = 'none'
        //console.log('Selected option:', originSelectionDropdown.value);
        // You can perform any actions you need here
        if(originSelectionDropdown.value === "Template Folder"){
            templateDropdwon.style.display = 'block'
        }else if(originSelectionDropdown.value === "User PC"){
            droparea.style.display = 'block'
        }
      });
    // Add event listener to each help icon
    tooltipQuestion.forEach(function(icon) {
        icon.addEventListener('click', function() {
        var index = this.getAttribute("value");
        displayMessage = lookupTooltip(index, tooltips)
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
  


});






