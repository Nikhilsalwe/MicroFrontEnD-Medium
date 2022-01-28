# some important points
**This is not create react app. currently create react react app does not support webpack 6 version with modulefederation plugin**
**ModuleFederationplugin help to configure allows JavaScript application to dynamically import code from another application at runtime**

# in this MFE example we are having one container which hots other expose app

## This application divide into 4 mono repo 
1. Auth
2. Dashboard
3. Marketing
4. Container

             Container
                |
      Marketing Pricing Auth        

# Container
Can say parent which host other mono app's. To acheive this we use webpack **Module federation plugin**
`new ModuleFederationPlugin({
            name: 'container',
            remotes: {
                marketing: 'marketing@http://localhost:8081/remoteEntry.js'
            },
            shared: packageJSON.dependencies
        })`

It takes multiple argument.
1. Name: name of container 
2. remotes : Here name giving in child app should be same in remotes key
3. 


# Marketing
It's child app.

`plugins: [
        new ModuleFederationPlugin({
            name: 'marketing',
            filename: 'remoteEntry.js',
            exposes: {
              './MarketingApp': './src/bootstrap',
            },
            shared: packageJSON.dependencies
          }),
        new HtmlWebpackPlugin({
            template: './public/index.html'
        })
    ]`

1. Name : name of child app. make sure same name we need to use in parent container in remotes to consume
2. filename : name of file which get expose through webpack after building
3. exposes : name of file which we want to expose from child app. 

Child app should also export mount function which parent container utilize to render child.



# CI/CD
## Deployment
- Want to deploy each MFE independently
- Location of each child remoteEnter must known at build time
- Many frontend deployment solution assume we deploy whole application at once, we need something that handle multiple things
- Need CI/CD = we are using git action
- At present remoteEntry filename is fix, caching we need to think later

### we are creating git mono repo , we can also have multiple repo.
### we help of git script we identify in which repo code gets push and for that repo only we trigger build
### then we upload all files to AMS S3 bucket
### we also use AWZ cloudfront manager service by AWZ which work as CDN

# Production setup
## Container

`const prodConfig = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
    publicPath: '/container/latest/'
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        marketing: `marketing@${domain}/marketing/latest/remoteEntry.js`,
      },
      shared: packageJson.dependencies,
    }),
  ],
};`

1. Moe: should be production
2. output : '[name].[contenthash].js' when we build file for prod, this is use to give file a name
3. Remotes: `marketing@${domain}/marketing/latest/remoteEntry.js` here we give production domain name

# Workflow for deploying container
When ever code is push to master branch
- Change into container folder
- install dependencies
- create prod build
- upload result to S3

# woekflow Creation
## Refer file container.yml incide .gihub/workflow folder

- Access / secerte key we can get from AWS IAM . And need to save those inside git  repo -> setting -> secrete -> new secrets
- All Env variable added in yml file are coming from github secrets

# CSS Issue
- MFE is SPA application means , multiple app will get loaded dynamically
- In such case we are not reloading application heance CSS may get cache and it will get overriden

## Solving prombile - CSS Scoping
- use CSS-in-JS which create dynamic class angular and VUE has inbuild style scoping
- Or add namespance all your CSS - means add app name at top element and use than name for other class for example
  - Container class is parent child element can have container h1, container span etc


# Implementing Navigation inside MFE
## Inflexible requirement 1
### Both container and individual app need  routing feature
- User can navigate to diff sub apps using routing logic written in container
- user can also navigate to subapps using routing logic written in subapp itself
- ** Not all subapps required routing **
**Solution :- Container and Sub app maintain seperate routing logic, it can have different version also as their is no direct communication between them**


## Inflexible requirement 2
### Sub-app might need to add in new pages/route all the time
- New route added to subapp should not require re-deployment of container
**Solution:- Container will use to decide whichMFE to show  and sub app decide which page to show**

## Inflexible requirement 3
### we might need to show 2 or more MFE at same time
- This occue many time when we have sidebar nav that is build as seperate MFE
  
  
## Inflexible requirement 4
### we want to use off-the-sheel routing solutions
- try to use existing routing provided by library 
- some modification is OK


## Inflexible requirement 
### we need navigation feature for sub-apps in production and isolation

## Inflexible Requirement 6
### Implementation should be generic

# Problems
- Routing has two important parts 
  - History - Which identify user is on which URL or page
  - Routing - on specific URL which page to show

## History
1. Browser history :- A DOM-specific implementation, useful in web browsers that support the HTML5 history API
   1. Looks URL in browser and then decide where to go
   2. **if we use browser history in container and sub=apps same then it will cause issue** 
   3. **So better to use browser hist in container and other for ex memory hist in sub apps**
2. Memory History:- An in-memory history implementation, useful in testing and non-DOM environments



