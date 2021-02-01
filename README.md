<p align="center"><img src="https://angular.io/assets/images/logos/angular/angular.svg" width="60px" height="100px"/>
<img src="https://raw.githubusercontent.com/webpack/media/master/logo/logo-on-white-bg.png"  height="100px"/>
</p>
<h1 align="center">Angular 11 Micro Front-Ends with Webpack 5 Module Federation</h3>

Currently support for MFEs are low. For the past 3 years I have been following this topic mostly fueled by Manfred Steyers' tech talks and articles. Various POCs have been built using Js modules, SingleSpa, Nx etc... but the greatest breakthrough was as a result of Zack Jackson and the Webpack 5 team who gave us [Module Federation](https://webpack.js.org/concepts/module-federation/) - hence this "giant leap" towards our MFE goals! However, still today, it is not fully supported in the latest Angular version (11). Angular cli is built on top of Webpack so we'll have to explicitly opt-in for this feature as of Jan 2021. Please bear this in mind going forward as you will have warnings in your build but I will elaborate on them during the steps. Most of my learnings came from [this course](https://www.pluralsight.com/courses/micro-frontends-architecture), [this series](https://www.angulararchitects.io/aktuelles/the-microfrontend-revolution-part-2-module-federation-with-angular/) and [these repos](https://github.com/module-federation/module-federation-examples).

I will try my best to explain this for a beginner but I do encourage checking out the links from the experts beforehand and [this excellent talk](https://www.youtube.com/watch?v=8_zvADItlGk&ab_channel=FrontendLove) from Manfred himself at FrontEnd Love. I have personally attended this conf before and it is highly recommended. It's all online now but is still just as insightful and inspiring for angular developers at all levels. The approach of this article is extremely granular and conversational, if it’s not for you - you can checkout the repo. For everyone else, let's jump in and learn something new!

## Steps

First we begin with the cli. Please delete your current globally installed cli version - clean slate. You may need to use sudo if you don’t have super duper admin rights on your OS profile (😿).

`npm uninstall -g @angular/cli`
`npm install -g @angular/cli@v11.0.0-next.6`

Remember the Angular CLI requires a minimum Node.js version of either v10.13 or v12.0. I use [n](https://github.com/tj/n) to manage my node versions easily from my terminal. Confirm your Angular cli version with `ng version`. It should now say `“Angular CLI: 11.0.0-next.6”` . We need this specific version to opt-in to Webpack 5 (Jan 2021).

 

Let’s create our apps using the CLI. Pay careful attention to the commands. We’re creating a minimal version of the app for the demo purposes and we want to skip installing the node modules. More on this later 🧷.

Create a new folder for your project and initialize it as a git repository. Trust me, you’ll want to commit your steps so you can review them or roll them back if you need to. Our approach is a monorepo hosting both the shell and mfe but you could have these as separate repos if you’d like or if you use Nx you may want to use their approach - this is up to you. I suggest this way first to understand how the host and child communicate with each other. Run these commands to create your project folder, shell(host) and mfe(child).

`ng new shell --skip-install`

`ng new mfe1 --skip-install`

But how do we force the app to use a Webpack version that is not supported by default? Enter Yarn resolutions. This allows us to use custom packages in your project. But wait a second you may say - should we be using yarn or npm? Unfortunately npm does not support this so we have to use Yarn going forward. 🧷 This is why we skipped installing the node_modules.  
    
 `npm install --global yarn  `
  
 Now that we have yarn installed (or if you had it already - nice!), let’s add the custom webpack version to our package.json in our project folder to the shell and mfe package.json files. You add it above “dependencies”.

 
`"resolutions":  {  "webpack":  "^5.0.0"  }`

  

Next we can tell our cli to use yarn going forward. Notice that the angular.json files are updated with the correct package manager. In your shell and mfe1 folders run

  

`ng config cli.packageManager yarn`

  

Now that our yarn admin is sorted - we do a yarn install for both the mfe and shell

  
`yarn install  `
  

  

Now comes the fun part - Manfred has made it so easy to integrate MFA into our angular projects using his amazing [plugin](https://www.npmjs.com/package/@angular-architects/module-federation)

We can add it to our apps in the relevant directories like so, using a port of your choice.  
  
`ng add @angular-architects/module-federation --project shell --port 9999`

`ng add @angular-architects/module-federation --project mfe1 --port 1111`

  

Make sure there are no error messages in your terminal. You should have two new webpack files created for each application. The contains webpack boilerplate as well as the plugins assistive config for you. We now have everything we need to let our apps talk to each other!

  
  
  

#### The Parent/Host/Shell
#### The Child/Remote/MFE1

Even though you can share a component in a child to the parent I’m going to share the entire child because this MFE will do only one thing. Remember that live reload is not currently supported so you'll have to hard-refresh.

  
  
### Let’s get them to talk to each other!  
  
Go to your shell and edit the webpack.config.js file that was created.  
  
Update your remotes to localhost: 1111 (you added this in the step above)

  
``remotes: {
"mfe1": "mfe1@http://localhost:1111/remoteEntry.js",
},``

  

  
Next, in your app.routes.ts add a path to our child. Note here we’re loading the whole app module, you can change it to any module in your app.  
```
{
	path: 'child',
	loadChildren: () =>
	loadRemoteModule({
	remoteEntry: 'http://localhost:1111/remoteEntry.js',
	remoteName: 'mfe1',
	exposedModule: './Module'
	}).then(m => m.AppModule)
}

```

  

Let’s go to the mfe1 app and expose our module in the webpack generated file  
  
```
exposes: {
	'./Module': './src/app/app.module.ts',
}
```
  

I’ve also added a route to the child app component to make our URL easier  

```
{ path: 'child', component: AppComponent, pathMatch: 'full'}

```

 
  

One final tip before we spin this up. Edit you package file  
`"start": "ng serve mfe1 -o --port 1111",`

`"start": "ng serve shell -o --port 9999",  `
  
Makes things a li’ easier :)

### The Urls    
[http://localhost:9999/mfe/child  
](http://localhost:9999/mfe/child)Shoutd show you MFE on your HOST!  
  
Still not sure? Let’s break it down  
[http://localhost:9999](http://localhost:9999/mfe/child) is your host  
[http://localhost:9999](http://localhost:9999/mfe/child)/mfe is your remote entry path  (child App)
[http://localhost:9999](http://localhost:9999/mfe/child)/mfe/child is your component path you declared  in your child App
  
  
You can check the network tab to confirm! There we have it! Now to run it in production...
