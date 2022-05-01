const inquirer = require('inquirer');
const { writeFile, copyFile } = require('./utils/generate-site.js');
const generatePage = require('./src/page-template');

const promptUser = () => {
return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is your name? (Required)',
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('Please enter your name!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'github',
            message: 'Enter your github username:'
        },
        {
            type: 'confirm',
            name: 'confirmAbout',
            message: 'Would you like to enter some information about yourself?',
            default: true
        },
        {
            type: 'input',
            name: 'about',
            message: 'Provide some information about yourself:',
            when: ({ confirmAbout }) => {
                if (confirmAbout) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]);
};

const promptProject = portfolioData => {
    //if there is not a 'projects; array propery, create one
    if(!portfolioData.projects) {
    portfolioData.projects = [];
    }

    console.log(`
    =================
    Add a New Project
    =================
    `);
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of your project? (required)',
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter your project's name!");
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'description',
            message: 'Provide a description of the project (required):',
            validate: projectInput => {
                if (projectInput) {
                    return true;
                } else {
                    console.log('Please enter the description!');
                    return false;
                }
            }
        },
        {
            type: 'checkbox',
            name: 'languages',
            message: 'what did you build this project with? (Check all that apply)',
            choices: ['JavaScript', 'HTML', 'CSS', 'ES6', 'jQuery', 'Bootstrap', 'Node']
        },
        {
            type: 'input',
            name: 'link',
            message: 'Enter the GitHub link to your project. (Required)',
            validate: githubInput => {
                if (githubInput) {
                    return true;
                } else {
                    console.log('Please enter the link!');
                    return false;
                }
            }
          },
          {
            type: 'confirm',
            name: 'feature',
            message: 'Would you like to feature this project?',
            default: false
          },
          {
            type: 'confirm',
            name: 'confirmAddProject',
            message: 'Would you like to enter another project?',
            default: false
          }
    ])
    .then(projectData => {
        portfolioData.projects.push(projectData);
        if (projectData.confirmAddProject) {
            return promptProject(portfolioData);
        } else {
            return portfolioData;
        }
    });
};

// We start by asking the user for their information with Inquirer prompts; this returns all of the data as an object in a Promise.
promptUser()
    // The promptProject() function captures the returning data from promptUser() and we recursively call promptProject() for as many projects as the user wants to add. Each project will be pushed into a projects array in the collection of portfolio information, and when we're done, the final set of data is returned to the next .then().
    .then(promptProject)
    // The finished portfolio data object is returned as portfolioData and sent into the generatePage() function, which will return the finished HTML template code into pageHTML.
    .then(portfolioData => {
        return generatePage(portfolioData);
    _})
    // We pass pageHTML into the newly created writeFile() function, which returns a Promise. This is why we use return here, so the Promise is returned into the next .then() method.
    .then(pageHTML => {
        return writeFile(pageHTML);
    })
    // Upon a successful file creation, we take the writeFileResponse object provided by the writeFile() function's resolve() execution to log it, and then we return copyFile().
    .then(writeFileResponse => {
        console.log(writeFileResponse);
        return copyFile();
    })
    // The Promise returned by copyFile() then lets us know if the CSS file was copied correctly, and if so, we're all done!
    .then(copyFileResponse => {
        console.log(copyFileResponse);
    })
    .catch(err => {
        console.log(err);
    });









