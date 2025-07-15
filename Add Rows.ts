function onOpen() {
  // Create custom menu under 'Actions' when the sheet opens
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Actions')
    .addItem('Add Rows', 'copyTemplateToBills')
    .addToUi();
}

function copyTemplateToBills() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var templateSheet = ss.getSheetByName("Template");
  var billsSheet = ss.getSheetByName("Bills");
  
  if (!templateSheet || !billsSheet) {
    SpreadsheetApp.getUi().alert("Error: One or both sheets ('Template' or 'Bills') not found.");
    return;
  }
  
  // Determine the range to copy: rows 1-10, all columns with data
  var lastColumn = templateSheet.getLastColumn();
  var numRows = 10;
  var sourceRange = templateSheet.getRange(1, 1, numRows, lastColumn);
  
  // Determine the destination starting row in Bills
  var firstEmptyRow = billsSheet.getLastRow() + 1;
  
  // Paste the data values
  var destinationRange = billsSheet.getRange(firstEmptyRow, 1, numRows, lastColumn);
  sourceRange.copyTo(destinationRange, {contentsOnly: false});
  
  SpreadsheetApp.getUi().alert("Rows 1-10 from 'Template' copied to 'Bills' with formatting successfully.");
}
