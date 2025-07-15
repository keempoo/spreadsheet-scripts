function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu("Actions") // Creates a menu in the Google Sheets UI
      .addItem("Update Transactions", "autoFillTransactionCategory") // Dropdown option to run script
      .addToUi();
}

function autoFillTransactionCategory() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var transactionsSheet = ss.getSheetByName("Transactions");
    var categoriesSheet = ss.getSheetByName("Categories");

    if (!transactionsSheet || !categoriesSheet) {
        Logger.log("One of the sheets is missing!");
        return;
    }

    var transactionsData = transactionsSheet.getDataRange().getValues();
    var categoriesData = categoriesSheet.getDataRange().getValues();

    var categoryMap = {};
    
    // Build a map of Category Names based on Column B of "Categories"
    for (var i = 1; i < categoriesData.length; i++) {
        var categoryValues = categoriesData[i][1]; // Column B in Categories
        var categoryName = categoriesData[i][0]; // Column A in Categories
        
        if (categoryValues) {
            var keywords = categoryValues.split(",").map(s => s.trim()); // Split by comma and remove spaces
            keywords.forEach(keyword => {
                categoryMap[keyword] = categoryName;
            });
        }
    }

    // Iterate through Transactions and auto-fill Column A if necessary
    for (var j = 1; j < transactionsData.length; j++) {
        var transactionKey = transactionsData[j][1]; // Column B in Transactions
        var currentCategory = transactionsData[j][0]; // Column A in Transactions

        if (transactionKey && currentCategory === "") {
            if (transactionKey in categoryMap) {
                transactionsSheet.getRange(j + 1, 1).setValue(categoryMap[transactionKey]); // Set Column A
            }
        }
    }
    
    SpreadsheetApp.getUi().alert("Categories have been updated!");
}
