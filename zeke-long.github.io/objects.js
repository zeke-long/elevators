class elevator {
	constructor(name) {
		this.elev_name = name;
		this.x = elevator_width*this.elev_name + (this.elev_name+1)*horiz_buffer;
		this.y = ground_floor;
		this.dest_floor = 0;
		this.curr_floor = 0;
		this.waiting_passengers = [];
		this.riding_passengers = [];
		this.open = false;
		this.open_time = 0;
		this.can_take_job = true;
		this.direction = this.get_direction();
	}

    get_direction(){
    	if(this.dest_floor < this.curr_floor){
    		return -1
    	}
    	if(this.dest_floor == this.curr_floor){
    		return 0
    	}
    	if(this.dest_floor > this.curr_floor){
    		return 1
    	}
    }

    check_passengers(){
    	console.log('check_passengers')
    	for (var i = 0; i < this.waiting_passengers.length; i++) {
    		if (this.waiting_passengers[i].x - this.x < 10){
    			console.log("Where the dest floor should be set")
    			this.dest_floor = this.waiting_passengers[i].dest_floor;
    			this.riding_passengers.push(this.waiting_passengers.splice(i,1))
			}
    	}
    }

	step() {
		this.check_passengers();
		
		if(this.waiting_passengers.length != 0){
			console.log("waiting_passengers check");
			console.log(this.waiting_passengers[0].curr_floor);
			if(this.curr_floor == this.waiting_passengers[0].curr_floor){
				this.open = true;
				this.open_time = 0;
				console.log("should stay open");
			}
		}

		

		if(this.open){
			if (this.open_time < 3){
				this.open_time++;
			}
			if (this.open_time >= 3){
				this.open_time = 0;
				this.open = false;
			}
			
		}
		else if(this.dest_floor < this.curr_floor){
			this.down_floor();
		}
		else if(this.dest_floor > this.curr_floor){
			this.up_floor();
		}
		else if(this.dest_floor == this.curr_floor){
		}
	}

	up_floor(){
		this.y -= elevator_height;
		this.curr_floor +=1;
	}
	down_floor(){
		this.y += elevator_height;
		this.curr_floor -=1;
	}
	open_doors(){
		this.open = true;
	}	
	reset(){
		this.y = ground_floor;
		this.curr_floor = 0;
		this.dest_floor = 0;
	}

	display() {
		fill(0,0,80);
		if (this.open){
			fill(80,80,0);
		}
		rect(this.x, this.y, elevator_width, elevator_height);
		text(this.curr_floor, this.x, this.y);
		text(this.dest_floor, this.x+elevator_width-horiz_buffer, this.y);
	}
}

class person {
	constructor(name, start_floor, dest_floor, in_line) {
		this.person_name = name
		this.curr_floor = start_floor;
		this.dest_floor = dest_floor;
		this.in_danger = 0;
		this.elevator = null;
		this.diameter = 10;
		this.x = elevator_count*(elevator_width+2*horiz_buffer) + in_line*(2*this.diameter + 1.5*horiz_buffer);
		this.y = ground_floor - (this.curr_floor*elevator_height) + elevator_height/2;
		this.speed = 40;
	}

	step() {
		if(this.elevator != null){
			if((this.x - this.elevator.x) > this.diameter){
				console.log("Person Step Walk")
				this.x = this.x - 25
			}
			else if((this.x - this.elevator.x) < this.diameter){
				remove_person(this)
			}
		}
	}

	display() {
		fill(0,60,60);
		if (this.elevator != null){
			fill(60,0,60);
		}
	    ellipse(this.x, this.y, 30,30);
	    fill(255,255,255)
	    text(this.dest_floor, this.x - 3, this.y+2)
	    text(this.person_name, this.x - 10, this.y+2)
	    if (this.elevator == null){
	    	text('None', this.x + 20, this.y+2)
	    }
	    else {
	    	text(this.elevator.elev_name, this.x - 20, this.y+2)
	    }
	}
}

class floor{
	constructor(i){
		this.floor_num = i;
		this.people = [];
		this.floor_height = ground_floor - i*elevator_height;
		this.elevators = [];
	}

	add_person_to_floor(person){
		this.people.push(person);
	}
	remove_person(person){
		for (var i = 0; i < this.people.length; i++) {
			if (this.people[i].person_name == person.person_name){
				this.people.slice(i,1);
			}
		}
		for (var i in this.people){
			console.log(i)
			console.log(this.people[i])
			this.people[i].x = this.people[i].x + 2*this.people[i].diameter + 1.5*horiz_buffer
		}
	}

	display(){
		line(0, this.floor_height, canvas_width, this.floor_height);
		line(0, this.floor_height+elevator_height, canvas_width, this.floor_height+elevator_height);
	}
	clear_floor(){
		this.people = [];
	}
}