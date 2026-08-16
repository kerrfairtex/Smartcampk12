# CONTRIBUTING

## New Issue

Before reporting an [issue](https://github.com/kerrfairtex/kerrfairtex/issues/), please consider the following recommendations:

1. Search [closed issues](https://github.com/kerrfairtex/kerrfairtex/issues?scope=all&utf8=%E2%9C%93&state=closed) or the [Wiki](https://github.com/kerrfairtex/kerrfairtex/wikis), your problem may already have been addressed. Please do not create **duplicates**.

2. Specify your KerrFairtex, PHP & PostgreSQL **versions**, along with the server & browser used.

3. Provide **steps to reproduce** the problem.

4. Attach a **screenshot**.

5. KerrFairtex errors, bugs (PHP, SQL, JS errors) & design or logic errors are welcome. _500 Internal Server Error_ messages can be found in the Apache `error.log` file.

6. **Installation problems**: KerrFairtex has been succesfully installed on various environments; nevertheless, you may encounter errors [specific to your OS, PHP or PostgreSQL version or configuration](https://github.com/kerrfairtex/kerrfairtex/blob/mobile/INSTALL.md#kerrfairtex-student-information-system). For the same reasons, installation problems will likely not be solved here.

7. **KerrFairtex use**: the Handbooks, the inline Help & the [Wiki](https://github.com/kerrfairtex/kerrfairtex/wikis) contain useful resources to help you get the most out of KerrFairtex. For all your questions about KerrFairtex use and school administration, you can discuss them in the [forum](https://www.kerrfairtex.org/forum/).

8. **Email support**: to get professional help with installation problems, or KerrFairtex configuration, please head to https://www.kerrfairtex.org/services/

You have PHP web development skills? Please head to the next section & send a [merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html).


## Contributing to KerrFairtex

Please head to the offical [Contribute page](https://www.kerrfairtex.org/contribute) to learn about how you can contribute to the project.

### Coding standards

1. We _roughly_ follow the [Wordpress Coding Standards](https://make.wordpress.org/core/handbook/coding-standards/).

2. [Comment your code](https://make.wordpress.org/core/handbook/best-practices/inline-documentation-standards/): we use PHPDoc.

3. Quality Assurance: we use code linters & other [QA tools](https://phpqa.io/)

4. Testing: Activate [debug mode](https://github.com/kerrfairtex/kerrfairtex/blob/mobile/INSTALL.md#optional-variables); for emails, we use [MailCatcher](http://mailcatcher.me/)

### Architecture

https://www.kerrfairtex.org/wp-content/uploads/2016/06/kerrfairtex-folders-files-architecture.png

### Meta

The [meta](https://github.com/kerrfairtex/kerrfairtex-meta/) repository provides tools to debug and scripts to run tests, QA and prepare KerrFairtex release.

### Example Module

Freely study and reuse the [Example module](https://github.com/kerrfairtex/Example)

