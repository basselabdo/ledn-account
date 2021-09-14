# Running the Code

navigate to root folder and run the following commands:

`npm install` to install the needed dependencies

`npm run build` to build the solution

`npm run start` to start the server

After building and running the code, you can either: 
1. Use postman to test it by making a `GET` call to this endpoint http://localhost:3000/accounts and add the needed parameters to the url (i.e. http://localhost:3000/accounts?country=ca&sortField=amt)
2. Using any browser, navigate to the [swagger](swagger.json) file to see the endpoint and the parameters it requires [Url](http://localhost:3000/docs)

To filter by `country` or `mfa`, it will accept both, upper or lower case values and it will skip the fields with `null` value. Also, when filtering by `name` I searched for th value in `firstName` and `lastName` fields of the account because, technically, the term `name` is combination of `first` and `last` name combined together.
# Testing the code

run the following command to run the unit tests:

`npm run test`


# Solution
I utilitzed my way of thinking in implementing the structure to make it well-structured and efficient as much as I could. I know that there could be a way better ways to do it :)

I built the structure in a way where I have the [application](./src/application) layer that is separate from the [infra](./src/infra) layer, where I managed all the read operation from the files [accounts](./input/accounts.json) [large-accounts](./input/accounts_large.json). The [application](./src/application/account) layer contains the account interface, service, respository.
The implementation of the [account-repository](./src/application/account/account-repository.ts) is in [infra](./src/infra/account) folder. The file [account-repository-impl](./src/infra/account/account-repository-impl.ts) implements the account respository interface.


I added a [configuration](./config) folder with [default.json](./config/default.json) in it, to make the paths to the files configurable and easier to be parsed in the code:
```json
{
    "account": {
      "src": "./input/accounts.json",
      "large-src": "./input/accounts_large.json"
    }
}
```
**NOTE**: To run the code against the small json [file](./input/accounts.json) -> simply go to this [line](./src/infra/account/account-repository-impl.ts#L17) and make it 
```ts
const jsonPath = this.appConfig.get<string>('infra.account.src');
```
or, to parse the big [file](./input/accounts_large.json) change it to:
```ts
const jsonPath = this.appConfig.get<string>('infra.account.large-src');
```

I also added an interface in [domain](./src/domain) folder to easily parse the json files into the defined interface [LednAccount](./src/domain/ledn-account.ts).

# Benchmarking
With the solution I applied, processing the json [files](./input) took (including the filter and sort):
- [account.json](./input/account.json)
   ```ts
   Elapsed time to parse 200 entries: 0.044 seconds
   ```
- [account_large.json](./input/account_large.json)
  ```ts
  Elapsed time to parse 100200 entries: 2.311 seconds
   ```
# Improvements
- Adding pagination to make it more efficient
- I can think of adding more validators to validate the query `parameters` and their values deinfed in the swagger [file](swagger.json#L18), I already did define `enums` in ([mfa](swagger.json#L31) and [sortField](swagger.json#L47) query parameter) and tried to be strict a bit, but this also can be improved on the codebase level.
- Adding more unit tests to handle more edge cases in the test. The current coverage is:
```ts
19 passing (50ms)

-----------------------------|----------|----------|----------|----------|-------------------|
File                         |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
-----------------------------|----------|----------|----------|----------|-------------------|
All files                    |      100 |    92.31 |      100 |      100 |                   |
 application/account         |      100 |      100 |      100 |      100 |                   |
  account-service-impl.ts    |      100 |      100 |      100 |      100 |                   |
 domain                      |      100 |      100 |      100 |      100 |                   |
  ledn-account.ts            |      100 |      100 |      100 |      100 |                   |
 infra/account               |      100 |    88.89 |      100 |      100 |                   |
  account-repository-impl.ts |      100 |    88.89 |      100 |      100 |             71,85 |
 web                         |      100 |      100 |      100 |      100 |                   |
  account-handler.ts         |      100 |      100 |      100 |      100 |                   |
  json-formatter.ts          |      100 |      100 |      100 |      100 |                   |
-----------------------------|----------|----------|----------|----------|-------------------|

=============================== Coverage summary ===============================
Statements   : 100% ( 60/60 )
Branches     : 92.31% ( 24/26 )
Functions    : 100% ( 18/18 )
Lines        : 100% ( 59/59 )
================================================================================
```