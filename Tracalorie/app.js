//Storage controller
const StorageCtrl =(function(){
  //public method
  return {
    storeItem:function(item){
      let items;
      //check if any items
      if(localStorage.getItem('items') === null) {
        items = [];
        //push new item
        items.push(item);
        //set LS
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        //get what already in LS
        items = JSON.parse(localStorage.getItem('items'));
        //push new item
        items.push(item);
        //reset LS
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item,index){
        if(updatedItem.id === item.id){
          items.splice(index, 1, updatedItem);
        }
      });

      localStorage.setItem('items', JSON.stringify(items));      
    },
    deleteItemFromStorage: function(id){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item,index){
        if(id === item.id){
          items.splice(index, 1);
        }
      });

      localStorage.setItem('items', JSON.stringify(items)); 
    },
    clearItemsFromStorage: function(){
      localStorage.removeItem('items');
    }
  }
})();

//Item controller
const ItemCtrl = (function(){
  //Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }
  
  //Data structure / state
  const data = {
    // items: [
    //   // {id:0, name: 'Steak dinner', calories: 200},
    //   // {id:1, name: 'Cookie', calories: 300},
    //   // {id:2, name: 'Egg', calories: 400}
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  //Public Methods
  return{
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories){
      let ID;
      //create id
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      //calories to number
      calories = parseInt(calories);

      //create new item
      newItem = new Item(ID, name, calories);

      //add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id){
      let found = null;
      //loop through items
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories){
      //calories to no
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item){
      if(item.id === data.currentItem.id){
        item.name = name;
        item.calories = calories;
        found = item;
      }
      });

      return found;
    },
    deleteItem: function(id){
      //get ids 
      const ids = data.items.map(function(item){
        return item.id;
      });

      //get index
      const index = ids.indexOf(id);

      //Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function(){
      data.items = [];
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    getCurrentItem: function(){
      return data.currentItem;
    },
    getTotalCalories: function(){
      let total = 0;
      //loop through items and cal
      data.items.forEach(function(item){
        total += item.calories;
      });
      //set total cal in ds
      data.totalCalories = total;

      return data.totalCalories;
    },
    logData: function(){
      return data;
    }
  }

})();

//UI controller
const UICtrl = (function(){
  const UIselectors = {
    itemList: `#item-list`,
    listItems: `#item-list li`,
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: `.clear-btn`,
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  //Public Methods
  return{
    populateItemList: function(items) {
      let html = '';

      items.forEach(function(item) {
        html += ` <li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong><em>${item.calories} calories</em>
        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
      </li>`;
      });

      //Insert list items
      document.querySelector(UIselectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UIselectors.itemNameInput).value,
        calories: document.querySelector(UIselectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item){
      //show list
      document.querySelector(UIselectors.itemList).style.display = 'block';
      //create li element
      const li = document.createElement('li');
      //add class
      li.className = 'collection-item';
      //add id
      li.id = `item-${item.id}`;
      //add html
      li.innerHTML = ` <strong>${item.name}: </strong><em>${item.calories} calories</em>
      <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
      //insert item
      document.querySelector(UIselectors.itemList).insertAdjacentElement('beforeend',li);
    },
    updateListItem: function(item){
      let listItems = document.querySelectorAll(UIselectors.listItems);

      //Turn node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong><em>${item.calories} calories</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
        }
      });
    },
    deleteListItem: function(id){
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function(){
      document.querySelector(UIselectors.itemNameInput).value = '';
      document.querySelector(UIselectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function(){
      document.querySelector(UIselectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UIselectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function(){
      let listItems = document.querySelectorAll(UIselectors.listItems);

      //turn node list intoarry
      listItems = Array.from(listItems);

      listItems.forEach(function(item){
        item.remove();
      });
    },
    hideList: function(){
      document.querySelector(UIselectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories){
      document.querySelector(UIselectors.totalCalories).textContent = totalCalories;
    },
    showEditState: function(){
      document.querySelector(UIselectors.updateBtn).style.display = 'inline';
      document.querySelector(UIselectors.deleteBtn).style.display = 'inline';
      document.querySelector(UIselectors.backBtn).style.display = 'inline';
      document.querySelector(UIselectors.addBtn).style.display = 'none';
    },
    clearEditState: function(){
      UICtrl.clearInput();
      document.querySelector(UIselectors.updateBtn).style.display = 'none';
      document.querySelector(UIselectors.deleteBtn).style.display = 'none';
      document.querySelector(UIselectors.backBtn).style.display = 'none';
      document.querySelector(UIselectors.addBtn).style.display = 'inline';
    },
    getSelectors: function() {
      return UIselectors;
    }
  }
})();

//App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
  //load event listener
  const loadEventListeners = function(){
    //Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    //Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click' ,
    itemAddSubmit);

    //disable submit or enter
    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    })

    //edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click',
    itemEditClick);

    //update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click',
    itemUpdateSubmit);

    //delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click',
    itemDeleteSubmit);

    //back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    //clear items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click',
    clearAllItemsClick);

  }

  //Add Item submit
  const itemAddSubmit = function(e) {
    //Get form ip from uictrl
    const input = UICtrl.getItemInput();
    
    //check for name and calorie ip
    if(input.name !== '' && input.calories !== ''){
      //add item 
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      //add item to ui list
      UICtrl.addListItem(newItem);

      //get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //store in LS
      StorageCtrl.storeItem(newItem);

      //clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  //Click edit item
  const itemEditClick = function(e){
    if(e.target.classList.contains('edit-item')){
      //get the list item id(item-0, item-1)
      const listId = e.target.parentNode.parentNode.id;

      //break into an arry
      const listIdArr = listId.split('-');

      //get the actual id
      const id = parseInt(listIdArr[1]);

      //get item
      const itemToEdit = ItemCtrl.getItemById(id);
    
      //set to current item
      ItemCtrl.setCurrentItem(itemToEdit);

      //add item to form
      UICtrl.addItemToForm();

    }

    e.preventDefault();
  }

  //update item submit
  const itemUpdateSubmit = function(e) {
    //get item input
    const input = UICtrl.getItemInput();

    //update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    //update UI
    UICtrl.updateListItem(updatedItem);

    //get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    //update lS
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();


    e.preventDefault();
  }

  //Delete button event
  const itemDeleteSubmit = function(e){
    //Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    //delete from ds
    ItemCtrl.deleteItem(currentItem.id);

    //delete from UI
    UICtrl.deleteListItem(currentItem.id);

    //get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    //delete from LS
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  //clear items event
  const clearAllItemsClick = function(){
    //delete all items from data structure
    ItemCtrl.clearAllItems(); 

    //get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    //Remove from UI
    UICtrl.removeItems();

    //clear from LS
    StorageCtrl.clearItemsFromStorage();

    //hide the ul
    UICtrl.hideList();
  } 

  //Public Methods
  return{
    init: function(){
      //clear edit states
      UICtrl.clearEditState();

      //Fetch items from data structure
      const items = ItemCtrl.getItems();

      //check if any items
      if(items.length === 0) {
        UICtrl.hideList();
      } else{
        //populate list with items
      UICtrl.populateItemList(items);
      }
       //get total calories
       const totalCalories = ItemCtrl.getTotalCalories();
       //add total calories to UI
       UICtrl.showTotalCalories(totalCalories);

      //Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, StorageCtrl, UICtrl);

//Initialize APP
App.init();