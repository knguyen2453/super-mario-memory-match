# Deployment a Static Web Application to Ubuntu on AWS EC2

This guide outlines steps for deploying a static web application to an EC2 instance on AWS.  By static we mean an application that does not have a back end or a database to set up.  For instructions on how to deploy a full stack application please go [here](https://github.com/Learning-Fuze/full-stack-project/blob/master/guides/DEPLOYMENT.md). The guide assumes that you have already provisioned an EC2 instance, that you have SSH access to the instance, along with nginx and certbot installed. Some parts of this guide may have been covered during class, but they are recorded here for future reference.

**Note:** This guide may use "EC2 Instance" and "Ubuntu" interchangeably, because your EC2 instance _should_ be running the Ubuntu operating system.

## Required Tools

This guide assumes EC2 Ubuntu 18.04 so all setup commands will be based on that.

### Create a Subdomain

Visit your domain name registrar and create a new `CNAME` DNS record for your project. The `CNAME` record should point to your main domain name.

> For example, if your domain name is `yourdomain.com` and your project's name is `memory-match`, then you'll create a `CNAME` record for `memory-match.yourdomain.com` that points to `yourdomain.com`.

Here is an example gif if for `namecheap.com`:

<p align='center'>
    <img src="images/mm-deployment-1.gif">
<p>


### Clone the Project

Connect to your EC2 instance over SSH.

For example:
```bash
ssh -i <location of pem file> ubuntu@<ip address>
```

<p align='center'>
    <img src="images/mm-deployment-2.gif">
<p>

You'll want to clone the project's source code into your home directory. Confirm that your current working directory is `/home/ubuntu` with the `pwd` command.

```bash
pwd
```

<p align='center'>
    <img src="images/mm-deployment-3.gif">
<p>

Ubuntu comes with `git` preinstalled so you can clone the project now. Replace `username` with the owner of the repository, `memory-match` with the name of the project, and `memory-match.yourdomain.com` with your project's subdomain. If the repository is private, then you'll be prompted for your GitHub username and password.

```bash
git clone https://github.com/username/memory-match memory-match.yourdomainhere.com
```

After the project is successfully cloned, running the `ls` command should show the project directory.

```bash
ls
```

<p align='center'>
    <img src="images/mm-deployment-4.gif">
<p>

The next few steps will be done from within the project directory, so change directories to the project. Replace `memory-match.yourdomainhere.com` with your subdomain.

```bash
cd memory-match.yourdomainhere.com
```

<p align='center'>
    <img src="images/mm-deployment-5.gif">
<p>

### Configure a Virtual Host for Nginx

When web browsers visit your project, they'll be making HTTP requests to your Nginx web server. However, Nginx doesn't know anything about your project by default. Therefor, a special configuration file needs to be created.

#### Copy the Template

Your starter files should have included a reference configuration in `guides/deployment/memory-match.example.conf`. Copy this file now, giving it a name that matches your project's subdomain.

> For example, if your project's subdomain is `memory-match.yourdomainhere.com`, then your configuration file's name should be `memory-match.yourdomainhere.com`. **There is no `.conf` at the end of the final file.**

**Note:** The default `ubuntu` user account of your EC2 instance does not have permission to modify files outside of its home directory, so the `cp` command will need to start with `sudo` to temporarily use the `root` user account.

```bash
sudo cp guides/deployment/memory-match.example.conf /etc/nginx/sites-available/memory-match.yourdomainhere.com
```

#### Edit the Configuration File

Now use `nano` to edit the copy you've created. Replace `memory-match.yourdomainhere.com` with your config file's name.

**Note:** The default `ubuntu` user account of your EC2 instance does not have permission to modify files outside of its home directory, so the `nano` command will need to start with `sudo` to temporarily use the `root` user account.

```bash
sudo nano /etc/nginx/sites-available/memory-match.yourdomainhere.com
```

Modify the `server_name` and `root` directives in the configuration file. For example, if your project name is `memory-match` and your domain is `yourdomainhere.com`, then your configuration file should look like this:

```conf
server {

  server_name memory-match.yourdomainhere.com;

  root /home/ubuntu/$server_name;

}

```

Your root should be pointing to the directory that has your `index.html`.  Keep in mind if your `index.html` is in a directory within your root directory, this will not work.  So please adjust accordingly.

#### Enable the Site

Once your configuration file has been edited, it's time to let Nginx know about it.

**Note:** The default `ubuntu` user account of your EC2 instance does not have permission to modify files outside of its home directory, so the `ln` command will need to start with `sudo` to temporarily use the `root` user account. Replace `memory-match.yourdomainhere.com` with your own configuration file's name.

1. Enable the site.
    ```bash
    sudo ln -s /etc/nginx/sites-available/memory-match.yourdomainhere.com /etc/nginx/sites-enabled/
    ```
1. Test your new configuration file. You should see confirmation messages that your configuration is valid.
    ```bash
    sudo nginx -t
    ```
1. Restart Nginx.
    ```bash
    sudo service nginx restart
    ```

#### Try it out!

Your project is now deployed! You should be able to visit your subdomain in a web browser to see the landing page of the app. If your domain has a `.dev` extension you need to complete the next step before viewing your website.  That is because the `dev` extension is a secure namespace, so you need HTTPS and an SSL certificate for your website to load on most browsers.

#### Enable SSL with Certbot

At this point, your web browser is not communicating with your application of a secure connection. Let's fix that! CertBot makes it easy to configure SSL for your project with one command.

**Note:** The default `ubuntu` user account of your EC2 instance does not have permission to run the `certbot` command, so it will need to begin with `sudo` to temporarily use the `root` user account.

```bash
sudo certbot --nginx
```

The following items may be requested of you by `certbot` if this is your first time running it:

1. Your _real_ email address is required for renewal and security notices.
1. You _must_ agree to the Let's Encrypt terms of service.
1. You _may_ opt to receive a newsletter from the EFF. You don't have to.
1. Choose your project for HTTPS activation.
1. Enable redirects to make all requests redirect to secure HTTPS connections.

#### Try it out again!!

Visit your subdomain again in a web browser and you should see a lock in the URL bar indicating that you are visiting the app over a private SSL connection!! ????????????

## Deploying Updates

"Redeploying" your project is required whenever fixes or new functionality has been added to its codebase. This process is much less involved than the initial deployment and the vast majority of it is simple repetition of some steps taken during your first deployment.

To get started, SSH into your EC2 instance.

### Pull the Latest Commits

Change directories to your project; it should be located at `/home/ubuntu/memory-match.yourdomainhere.com`. Change `memory-match.yourdomainhere.com` to your project's subdomain.

```bash
cd /home/ubuntu/memory-match.yourdomainhere.com
```

Pull the `master` branch of your GitHub repository.

```bash
git pull origin master
```

Now all of your most recent changes are downloaded!

### Done!

Congratulations, your project has bee redeployed. ???????????? **Note:** You may need to "Empty Cache and Hard Reload" in your browser to see the latest updates.
