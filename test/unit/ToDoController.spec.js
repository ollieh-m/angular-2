describe('ToDoController', function(){

  beforeEach(module('toDoApp'));

  var ctrl;
  var factory;
  var httpbackend;
  var data;
  var fs;

  beforeEach(inject(function($controller,ToDoFactory,$httpBackend,FilterService){
    ctrl = $controller('ToDoController');
   	fs = FilterService;
    factory = ToDoFactory;

    spyOn(fs,'ammendToDos').and.callThrough();

    httpbackend = $httpBackend;
		data = [new ToDoFactory('ToDo1',true),new ToDoFactory('ToDo2',false)];
    httpbackend.expect('GET','http://quiet-beach-24792.herokuapp.com/todos.json').respond(data);
    httpbackend.flush();
  }));

  it('should call the filterService function on filter with the filter status and current todos', function(){
  	ctrl.filter = 'All';
  	ctrl.filterToDos();
  	expect(fs.ammendToDos).toHaveBeenCalledWith(ctrl.filter,ctrl.todos);
  });

  it('initialises with several todos', function() {
    var todo1 = new factory(data[0].text, data[0].completed);
    var todo2 = new factory(data[1].text, data[1].completed);
    expect(ctrl.todos).toEqual([todo1, todo2]);
  });

  it('adds a ToDo object to the todos array with the addToDo() function', function(){
  	ctrl.addToDo('ToDo');
  	expect(ctrl.todos[ctrl.todos.length-1].text).toEqual('ToDo');
  });

  it('sets the task of the ToDo object as not completed when the todo is added', function(){
  	ctrl.addToDo('ToDo');
  	expect(ctrl.todos[ctrl.todos.length-1].completed).toEqual(false);
  });

  it('removes the last task in the array with the removeToDo() function', function(){
  	ctrl.removeToDo();
  	expect(ctrl.todos.length).toEqual(1);
  });

  it('sets a filter status', function(){
  	ctrl.setFilterStatus('Active');
  	expect(ctrl.filter).toEqual('Active');
  });

  it('clears the completed todos from the list', function(){
    ctrl.clearCompleted();
    expect(ctrl.todos.length).toEqual(1);
    expect(ctrl.todos[0].completed).toEqual(false);
  });

  it('returns the total number of tasks for the current filter', function() {
    expect(ctrl.total).toEqual(2)
    ctrl.setFilterStatus('Active');
    ctrl.filterToDos();
    expect(ctrl.total).toEqual(1);
    ctrl.setFilterStatus('All');
    ctrl.filterToDos();
    expect(ctrl.total).toEqual(2);
  });

});
