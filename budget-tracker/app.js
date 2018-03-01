//Budget Module
var budgetController = (function(){

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  Expense.prototype.expensePercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round(this.value/totalIncome*100);
    } else {
      this.percentage = -1;
    }
  };
  Expense.prototype.getPercentage = function() {
    return this.percentage;
  }

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (current){
      sum += current.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems:{
      exp: [],
      inc: []
    },
    totals:{
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return{
    addItem: function(type, des, val) {
      var newItem, id;

      //Create new id based on last id of the selected array
      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        id = 0;
      }


      if (type === 'exp') {
        newItem = new Expense(id, des, val);
      } else if (type === 'inc') {
        newItem = new Income(id, des, val);
      }
      data.allItems[type].push(newItem);
      return newItem;
    },

    deleteItem: function(type, id) {
      var index, idArray;
      //create an array of all ids and figure out index of the id we need
      idArray = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = idArray.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function() {
      //Calculate Total Income and expenses
      calculateTotal('exp');
      calculateTotal('inc');
      //Calculate Bubdget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      //Calculate Precentage of income spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
      } else {
        data.percentage = -1;
      }
    },

    calculateExpensePercentages: function() {
      data.allItems.exp.forEach(function(current) {
        current.expensePercentage(data.totals.inc);
      });
    },

    getExpensePercentages: function() {
      var expensePercentages = data.allItems.exp.map(function(current) {
        return current.getPercentage();
      });
      return expensePercentages;
    },

    getBudget: function() {
      return{
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    }
  }

})();

//UI Module
var uiController = (function() {

  //Focal point for all the DOM elements used by the app
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercentageLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
    //Each DOM element used is a property within the object so that if there are
    //any changes in the HTML doc for any reason then the new elements can
    //be reassigned to the existing property instead of going on a witch hunt
    //to find every instance where the element was called directly
  };

  var nodeListForEach = function(list, callbackFn) {
    for (var i = 0; i < list.length; i++) {
      callbackFn(list[i], i);
    }
  };

  var formatNumber = function(num, type) {
    var numSplit, int, dec, sign;
    /*
    + for income
    - for expense
    2 decimal points
    , seperating the thousands
    */
    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');
    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length-3,3);
    }
    dec = numSplit[1];

    return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;
  }

  return{
    getInput: function() {
      //Option values are inc (+) and exp (-)
      return{
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    getDOMstrings: function() {
      return DOMstrings;
    },

    addListItem: function(obj, type) {
      var html, newHTML, element;
      // Create HTML string with place holder tags
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%">'+
        '<div class="item__description">%description%</div><div class="right clearfix">'+
        '<div class="item__value">%value%</div><div class="item__delete">'+
        '<button class="item__delete--btn"><i class="ion-ios-close-outline">'+
        '</i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%">'+
        '<div class="item__description">%description%</div>'+
        '<div class="right clearfix"><div class="item__value">%value%</div>'+
        '<div class="item__percentage">21%</div><div class="item__delete">'+
        '<button class="item__delete--btn"><i class="ion-ios-close-outline">'+
        '</i></button></div></div></div>';
      }
      //Replace the place holder text with data
      newHTML = html.replace('%id%',obj.id);
      newHTML = newHTML.replace('%description%',obj.description);
      newHTML = newHTML.replace('%value%',formatNumber(obj.value,type));
      //Insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);
    },

    deleteListItem: function(id) {
      var element = document.getElementById(id);
      element.parentNode.removeChild(element);
    },

    clearFields: function() {
      var fields, fieldsArray;
      fields = document.querySelectorAll(DOMstrings.inputDescription+','+
                                         DOMstrings.inputValue);
      fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(function(current, index, array) {
        current.value = '';
      });

      fieldsArray[0].focus();
    },

    displayBudget: function(obj) {
      var type;

      obj.budget > 0 ? type = 'inc' : type = 'exp';

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
      document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp,'exp');
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage+'%';
      } else{
        document.querySelector(DOMstrings.percentageLabel).textContent = '--';
      }
    },

    displayExpensePercentages: function(expPercentages) {
      var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

      nodeListForEach(fields, function(current, index) {
        if (expPercentages[index] > 0) {
          current.textContent = expPercentages[index] + '%';
        } else {
          current.textContent = '--';
        }
      });

    },

    displayMonth: function() {
      var today, year, month, allMonths;

      today = new Date();
      year = today.getFullYear();

      allMonths = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November',
                   'December'];
      month = today.getMonth();

      document.querySelector(DOMstrings.dateLabel).textContent = allMonths[month]
                                                                 + ' ' + year;
    },

    changedType: function() {
      var fields = document.querySelectorAll(
        DOMstrings.inputType + ',' +
        DOMstrings.inputDescription + ',' +
        DOMstrings.inputValue
      );

      nodeListForEach(fields, function(current) {
        current.classList.toggle('red-focus');
      });

      document.querySelector(DOMstrings.inputButton).classList.toggle('red');
    }
  };

})();

//Global App Module
//This module tell other modules what to do
var appController = (function(budgetCtrl,uiCtrl) {

  var setUpEventListeners = function() {
    var DOM = uiCtrl.getDOMstrings();

    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      if (event.KeyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', uiCtrl.changedType);
  }

  var updateBudget = function() {
    //1. Calculate total budget
    budgetCtrl.calculateBudget();
    //2. Return the budget
    var budget = budgetCtrl.getBudget();
    //3. Display Budget on ui
    uiCtrl.displayBudget(budget);
  }

  var updatePercentages = function() {
    //1. Calculate Percentages
    budgetCtrl.calculateExpensePercentages();
    //2. Read percentages from budget controller
    var expensePercentages = budgetCtrl.getExpensePercentages();
    //3. Update UI
    uiCtrl.displayExpensePercentages(expensePercentages);
  }

  var ctrlAddItem = function() {
    var input, newItem;
    //TO-DO
    //1. Get input data
    var input = uiCtrl.getInput();
    //Test Input field for actual inputs
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      //2. Add item to budget controller
      newItem = budgetCtrl.addItem(input.type,input.description,input.value);

      //3. Add item to ui
      uiCtrl.addListItem(newItem, input.type);

      //Clear the fields
      uiCtrl.clearFields();

      // Calculate and Update Budget
      updateBudget();

      //Update Expense Percentages
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, id;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      id = parseInt(splitID[1]);

      //1. delete item from data structure
      budgetCtrl.deleteItem(type, id);

      //2. delete the item from ui
      uiCtrl.deleteListItem(itemID);

      //3. update total budget
      updateBudget();

      //Update Expense Percentages
      updatePercentages();
    }
  };
//EVENT DELEGATION
//When an event occurs it fires upwards through the parents until reaches
//the HTML doc it self. This allows us to set up event handlers on parent
//elements
//Cases for Event Delegation
//1.when we have an element with lots of child elements that we are interested in
//2.when we want an event handler attached to an element that is not yet in the DOM

  return{
    init: function() {
      console.log('App Started');
      uiCtrl.displayMonth();
      setUpEventListeners();
      uiCtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
    }
  };
})(budgetController, uiController);

appController.init();
