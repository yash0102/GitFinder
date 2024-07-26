
# GitFinder

GitFinder is a simple, fast, and easy-to-use web application that leverages the GitHub API to fetch and display user information. The application features both dark and light themes and a responsive design to ensure it looks great on any device.



## Tech Stack

**Client:** HTML, CSS, JavaScript, API



## Features

- Fetch and display GitHub user information
- Fetch and display user repositories
- Fetch and display user followers
- Fetch and display user following
- Dark and light theme support
- Responsive design for various device sizes
## API Reference

#### Get User

```http
  GET https://api.github.com/users/username
```


#### Get User Repository 

```http
  GET https://api.github.com/users/username/repos
```


#### Get User Follower

```http
  GET https://api.github.com/users/username/followers
```


#### Get User Following 

```http
  GET https://api.github.com/users/username/following{/other_user}",

```
## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/yash0102/GitFinder.git
    ```

2. Navigate to the project directory:

    ```sh
    cd GitFinder
    ```

3. Open `index.html` in your browser to view the application.

## Usage

1. Enter a GitHub username in the search bar.
2. Click on the search button or Enter to fetch and display the user's information.
3. Navigate between the different sections (Repositories, Followers, Following) using the provided tabs.


## Authors

- [@yash0102](https://github.com/yash0102)