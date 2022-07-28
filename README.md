# simulated-damage

This is a program that uses the REST API
The API services are not deployed online, so it requires
downloading and setting up a temporary node server on local computer

download the files first
in the terminal, go to the folder and download express and cors

npm i -S express cors

to use the API in terminal type

node app.js

While the server is running, you may now use the services
from your localhost via

http://localhost:3000

the type of API calls you can make are

/type

/attack

/defense

/critical

/damage

/type has ?type1=[int]&type2=[int]

/attack has ?atk=[int]&buff1=[int]&debuff1=[int]

/defense has ?def=[int]&buff2=[int]&debuff2=[int]

/critical has ?chance=[int]

/damage has all of the above

example of running in browser for /type

http://localhost:3000/type?type1=0&type2=1

To see a webpage using this API, You may use the provided html file or go to

https://temporalcatcher.github.io/simulated-damage/

the webpage requires the app.js to be running and uses
the /damage call to the fullest, which uses all of the other services in one sitting
