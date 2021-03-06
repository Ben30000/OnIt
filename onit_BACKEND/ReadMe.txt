This backend targets users, tasks tables on the rds using raw json body in the case of post requests

Please make sure to modify the fields of any post request json body based on the functionality you are testing, you
need access to the rds db using dbeaver in order to access ids and other info needed for the manual testing using postman

The json based backend is currently deployed on the server for receiving post requests on the following endpoints:
 /checkActiveSession
 /register 
 /login
 /logout
 /updateUserInfo
 /deleteAccount
 /downloadMyData
 /updateEmailReminders
 /updateDailyGoals
 /addTask
 /updateTask
 /deleteTask
 /viewTasks
 /completeTask
 /viewCompleted
 /duedateTask
 /viewDuedate
 /setRepeatableTask

All the above endpoints persist data on rds in cases of record CRUD.

How to test using postman?

0) Test /checkActiveSession endpoint?
GET url: http://142.93.205.142:8090/OnItJson/checkActiveSession
GET
	If user is logged in, this returns the User instance of that user
	If user in not logged in, this returns null


1) Test /register endpoint?
Post url: http://142.93.205.142:8090/OnItJson/register
POST
Body-raw-json: Please change the values for firstname, lastname, email, password
                  {
		    "firstname":"new",
 		    "lastname": "register1",
		    "email": "trial10@trial.com",
		    "password": "12345"
		  }

Different scensiors: 1) new user: should receive 200 ok along with a serializable token
                     2) registered user: attempting to register with a registered email returns 200 ok along with 1, not a serializable token
			the email is used to decide whether a user is registered or not


2) Test /login endpoint?
Post url: http://142.93.205.142:8090/OnItJson/login
POST
Body-raw-json:
		{
		    "email": "a@b.com",
		    "password": "c"
		}
Different scenarios:
 		1) Logging in a registered user (email/password are in the db) using correct email and password: returns 200 ok and a user object
		2) Loggin in a non registered user returns 200 ok and 1, not a user object


3) Test /logout endpoint?
GET url: http://142.93.205.142:8090/OnItJson/logout
GET
                Successful logging out should return true

4) Test /updateUserInfo endpoint?
Post url: http://142.93.205.142:8090/OnItJson/updateUserInfo 
POST
Body-raw-json: here, we expect to receive a User object (in json) from the frontend, we update the User record that is 
already in the system using saveOrUpdate() at the dao layer

There are two scenarios:
A] Update user info without changing the password: isPasswordChanging json field is left blank
{
    "id": non_modifiable_id_of_the_user,
    "firstname": modifiable,
    "lastname": modifiable,
    "email": modifiable,
    "password": non_changed,
    "accountCreated": non_modifiable,
    "receiveEmailReminders": modifiable,
    "goal": modifiable,
    "isPasswordChanging": "" 
}

B] Update user info with changing password: isPasswordChanging json field is "y"
{
    "id": non_modifiable_id_of_the_user,
    "firstname": modifiable,
    "lastname": modifiable,
    "email": modifiable,
    "password": new_password_from_client_side,
    "accountCreated": non_modifiable,
    "receiveEmailReminders": modifiable,
    "goal": modifiable,
    "isPasswordChanging": "y" 
}


5) Test /deleteAccount endpoint? When a logged in user decides to delete his/her account, they are prompted to provide their
password as a means of confirming their account, they provide the pwssword account and hit a delete my account button, this
leads to a post request on the /deleteAccount endpoint.

Post url: http://142.93.205.142:8090/OnItJson/deleteAccount
POST
Body-raw-json:
		{
		    "password": "c"
		}
Different scenarios:
		1) Deleting a loggedin user after he/she successfully provide the correct password: return 200 ok, true
		2) Any other issue such as providing the wrong password: returns 200 ok, false


6) Test /downloadMyData endpoint? 
GET url: http://142.93.205.142:8090/OnItJson/downloadMyData 
GET
                Successful download my data request by a logged in user returns 200 ok user data except id and password (stored in hashed format)
		

7) Test /updateEmailReminders endpoint? 
Post url: http://142.93.205.142:8090/OnItJson/updateEmailReminders 
POST
Body-raw-json:
		{
		    formInteger: "2"
		}
	
		Successful update by a logged in user returns 200 ok and true

8) Test /updateDailyGoals endpoint? 
Post url: http://142.93.205.142:8090/OnItJson/updateDailyGoals
POST
Body-raw-json:
		{
		    formInteger: "2"
		}
	
		Successful update by a logged in user returns 200 ok and true


9) Test /addTask endpoint?
Post url: http://142.93.205.142:8090/OnItJson/addTask 
POST
Body-raw-json: Please change the values for taskName, notes, dueDate, reminder, repeatable
                  {
		    "taskName":"visit friends in CA",
		    "notes": "",
		    "dueDate": "2021-11-15"
		    "reminder": "2",
		    "repeatable": "false"
		  }
		
		dueDate is a string representing the date in this format "yyyy-mm-dd"

		A successful task insertion returns 200 ok and a serializable, of course adding a task requires
                an authenticated user (loggedin user) and uses the user id as a foreign key on the database tasks table


10) Test /updateTask endpoint?
Post url: http://142.93.205.142:8090/OnItJson/updateTask 
POST
Body-raw-json: here, we expect to receive a task object from the frontend, we update a task that is already in the system
using saveOrUpdate() at the dao layer
		
		Any modifiable date is a string in the format "yyyy-mm-dd"
		{
			"id": unmodifiable_the_id_of_an_existing_task_to_be_updates,
			"userId": unmodifiable_the_id_of_the_user_owning_this_Task,
			"taskName": modifiable_original_or_new_value,
			"notes": modifiable_original_or_new_value,
			"dateCreated": unmodifiable
			"dueDate": modifiable_original_or_new_value,
			"dateCompleted": modifiable_original_or_new_value,
			"reminder": modifiable_original_or_new_value,
			"repeatable": modifiable_original_or_new_value
		}


11) Test /deleteTask endpoint?
Post url: http://142.93.205.142:8090/OnItJson/deleteTask 
POST
Body-raw-json: we just need the taskId from the frontend
	{
		"formString": "9df7050c-c3e9-404e-9094-6096e390a8d2"
	}

12) Test /viewTasks endpoint?
GET url: http://142.93.205.142:8090/OnItJson/viewTasks
GET
	If user has any tasks, this returns a json of all the tasks
	If user doesn't have any task, this returns null


13) Test /completeTask endpoint?
Post url: http://142.93.205.142:8090/OnItJson/completeTask
POST
Body-raw-json: here, we expect to receive a task object from the frontend, we update a task that is already in the system
using saveOrUpdate() at the dao layer. We note the current date/time and change the dateCompleted field of that task accordingly
Any modifiable date is a string in the format "yyyy-mm-dd"
		{
			"id": unmodifiable_the_id_of_an_existing_task_to_be_updates,
			"userId": unmodifiable_the_id_of_the_user_owning_this_Task,
			"taskName": modifiable_original_or_new_value,
			"notes": modifiable_original_or_new_value,
			"dateCreated": unmodifiable
			"dueDate": modifiable_original_or_new_value,
			"dateCompleted": modifiable_original_or_new_value,
			"reminder": modifiable_original_or_new_value,
			"repeatable": modifiable_original_or_new_value
		}


14) Test /viewCompleted endpoint?
GET url: http://142.93.205.142:8090/OnItJson/viewCompleted
GET
	If user has any completed tasks, this returns a json of only the completed tasks
	If user doesn't have any completed tasks, this returns null


15) Test /duedateTask endpoint?
Post url: http://142.93.205.142:8090/OnItJson/duedateTask 
POST
Body-raw-json: here, we expect to receive a task object from the frontend with the updated dueDate, we update a task that is already in the system
using saveOrUpdate() at the dao layer.

                {
			"id": unmodifiable_the_id_of_an_existing_task_to_be_updates,
			"userId": unmodifiable_the_id_of_the_user_owning_this_Task,
			"taskName": unchanged,
			"notes": unchanged,
			"dateCreated": unmodifiable,
			"dueDate": must_be_changed,
			"dateCompleted": unchanged,
			"reminder": unchanged,
			"repeatable": unchanged
		}


16) Test /viewDuedate endpoint?
Post url: http://142.93.205.142:8090/OnItJson/viewDuedate 
POST
Body-raw-json: we just need the upperBoundDate to which we return all tasks with duedate less than or equal to
	{
		"formString": "2021-11-01"
	}

17) Test /setRepeatableTask endpoint?
Post url: http://142.93.205.142:8090/OnItJson/setRepeatableTask 
POST
Body-raw-json: here, we expect to receive a task object from the frontend with the updated repeatable (false to true or vice versa)
		{
			"id": unmodifiable_the_id_of_an_existing_task_to_be_updates,
			"userId": unmodifiable_the_id_of_the_user_owning_this_Task,
			"taskName": unchanged,
			"notes": unchanged,
			"dateCreated": unmodifiable,
			"dueDate": unchanged, 
			"dateCompleted": unchanged,
			"reminder": unchanged,
			"repeatable": must_be_changed
		}

