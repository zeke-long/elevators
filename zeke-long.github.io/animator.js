let horiz_buffer = 10;
let vert_buffer = 10;
let elevator_height = 50;
let elevator_width = 30;
let canvas_height = 500;
let canvas_width = 800;
let ground_floor = canvas_height - elevator_height - 20;


let elev_dict = {};
let floor_dict = {};
let people_dict = {};
let job_dict = {};
let elev_pos = [];
let draw_func = true;
let floor_count = 4;
let elevator_count = 2;
let max_elevator = 12;
let max_floor = 8;
let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var itr = 1;



function setup(){	
	createCanvas(canvas_width, canvas_height);
	background(140);
	frameRate(1);
	
	elevSlider = createSlider(1, max_elevator, 4);
	elevSlider.position(20, 20);
	floorSlider = createSlider(2, max_floor, 4);
	floorSlider.position(20, 40);
	peopleSlider = createSlider(0, 100, 5);
	peopleSlider.position(20, 60);

	for (var i = 0; i < elevSlider.value(); i++) {
		add_elevator();
	}
	for (var i = 0; i < floorSlider.value(); i++) {
		add_floor();
	}
}

function draw(){
	fill(150, 0, 0);
  	ellipse(25, 150, 25, 25);
 	frameRate(10);
	if (draw_func){
		main_draw();
	}
}

function mousePressed(){
	let d = dist(mouseX, mouseY, 25, 150);
	if (d<25){
		draw_func ^= true;
	}
}

function main_draw(){
	frame_rate = 30;
	frameRate(frame_rate);
	background(140);
	fill(0, 150, 0);
  	ellipse(25, 150, 25, 25)
  	fill(0, 0, 0);


	elevator_count = elevSlider.value();
	floor_count = floorSlider.value();
	var people_percent = peopleSlider.value();

	text('Number of Elevators: ' + elevator_count, elevSlider.x * 2 + elevSlider.width, 27);
	text('Number of Floors: ' + floor_count, floorSlider.x * 2 + floorSlider.width, 47);
	text('People Percent: ' + people_percent + "%", peopleSlider.x * 2 + peopleSlider.width, 67);
	
	resolve_sliders();
	display();
	get_situation();
	assign_jobs();
	
	if (itr%(frame_rate*3) == 0){
		itr = 1;
		run_steps(people_percent);
	}
	itr ++
}

function display(){
	for (var i in elev_dict){
		elev_dict[i].display();
	}
	for (var i in floor_dict){
		floor_dict[i].display();
	}
	for(var i in people_dict){
		people_dict[i].display();
	}
}

function run_steps(people_percent){
	for (var i in elev_dict){
		elev_dict[i].step()
	}
	for (var i in people_dict){
		people_dict[i].step()
	}
	if (Math.floor(random(0,100))<=people_percent){
		add_person();
	}
}

function resolve_sliders(){
	if(elevator_count > Object.keys(elev_dict).length){
		add_elevator();
		people_dict = {};
		for(var i in floor_dict){
			floor_dict[i].clear_floor();
		}
	}
	if(elevator_count < Object.keys(elev_dict).length){
		remove_elevator();
		people_dict = {};
		for(var i in floor_dict){
			floor_dict[i].clear_floor();
		}
	}

	if(floor_count > Object.keys(floor_dict).length){
		add_floor();
	}
	if(floor_count < Object.keys(floor_dict).length){
		remove_floor();
	}
}

function get_situation(){
	for(var person in people_dict){
		var this_person = people_dict[person]
		var job = [this_person.curr_floor, this_person.dest_floor]
		if (!(this_person.person_name in job_dict) && this_person.elevator == null){
			job_dict[this_person.person_name] = job
		}

	}
}

function assign_jobs(){
	for (var job in job_dict) {
		this_job = job_dict[job];
		for (var elevator in elev_dict){
			this_elevator = elev_dict[elevator];
			if(this_elevator.curr_floor == this_job[0] && this_elevator.can_take_job == true)
			{
				give_job(this_elevator, this_job, people_dict[job]);
				delete job_dict[job];
				break;
			}
		}
	}
}


function give_job(elevator, job, person){
	console.log(job_dict)
	elevator.can_take_job = false;
	
	person.elevator = elevator;
	elevator.waiting_passengers.push(person);
	console.log(elevator.waiting_passengers)
}



////////// HELPERS ///////////////






function add_elevator(){
	var g = 0;
	while(g in elev_dict){
		g++;
	}
	elev_dict[g] = new elevator(g);
}

function remove_elevator(){
	for (var i = elevator_count; i <= max_elevator; i++){
		if(i in elev_dict) {
   			delete elev_dict[i];
    	}

	}
}

function reset_elevators(){
	for (var i in elev_dict){
		elev_dict[i].reset();
	}
}

function add_floor(){
	var g = 0;
	while(g in floor_dict){
		g++;
	}
	floor_dict[g] = new floor(g);
}

function remove_floor(){
	for (var i = floor_count; i <= max_floor; i++){
		if(i in floor_dict) {
   			delete floor_dict[i];
   			reset_elevators();
    	}

	}
}

function add_person(){
	start_floor = Math.floor(random(0,floor_count));
	dest_floor = Math.floor(random(0,floor_count));
	in_line = floor_dict[start_floor].people.length;
	
	var g = 0;
	while(g in people_dict){
		g++;
	}

	additional_person = new person(g, start_floor, dest_floor, in_line);
	people_dict[g] = additional_person;
	floor_dict[start_floor].add_person_to_floor(additional_person);
}

function remove_person(person){
	delete people_dict[person.person_name]
	floor_dict[person.curr_floor].remove_person(person)
}