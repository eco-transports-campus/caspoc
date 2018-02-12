# Example of CAS authentication for U-PSUD CAS

## How to run?

In a terminal, type:
```
npm update
node index.js
```

Then, access in your browser `localhost:1234`.
You can try these URLs :
- `localhost:1234`: the index page. Displays whether you're authenticated or not
- `localhost:1234/app`: the authenticated-only area. You need to be logged-in to access the page. It displays the informations provided by the CAS.
- `localhost:1234/logout`: the logout page