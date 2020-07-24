## Save Shifter

It lets you transfer saved posts from one reddit account to another

## Usage

// add env stuff here

If you have docker installed, you can just run ```docker-compose up```. If you have node, you can run ```npm install```, and then ```npm start```. You should be able to access the app on ```localhost:3000```.

### Todo

- Add filters so you can see all your saved posts, and then filter them down to just posts from certain subs
- Tidy up the UI and make it look not horrible
- Move the render functions into their own components
- Work out why the remove posts button only seems to start removing posts after you click it a second time


### Maybe todo

- Replace insane state logic with reducers
- Replace insane render logic with react router
- Replace insane auth logic with just a username / password login for each account
