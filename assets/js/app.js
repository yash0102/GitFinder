'use strict';

import { fetchData } from "./api.js";
import { numberToKilo } from "./module.js";

/**
 * Add eventlistener on multiple elements
 * @param {NodeList} $elements NodeList
 * @param {String} eventType String
 * @param {Function} callback function
 */

const addEventOnElements = function($elements, eventType, callback) {
    for (const $item of $elements) {
        $item.addEventListener(eventType, callback);
    }
}

// Header Scroll State
const $header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
    $header.classList[window.scrollY > 50 ? "add" : "remove"]("active");
});

// Search toggle
const $searchToggler = document.querySelector("[data-search-toggler]");
const $searchField = document.querySelector("[data-search-field]");
let isExpanded = false;

$searchToggler.addEventListener("click", function () {
    $header.classList.toggle("search-active");
    isExpanded = isExpanded ? false : true;
    this.setAttribute("aria-expanded", isExpanded);
    $searchField.focus();
});

// Tab Navigation
const $tabBtns = document.querySelectorAll("[data-tab-btn]");
const $tabPanel = document.querySelectorAll("[data-tab-panel]");

let [$lastActiveTabBtn] = $tabBtns;
let [$lastActiveTabPanel] = $tabPanel;

addEventOnElements($tabBtns, "click", function () {
    $lastActiveTabBtn.setAttribute("aria-selected", false);
    $lastActiveTabPanel.setAttribute("hidden", "");

    this.setAttribute("aria-selected", "true");
    const $currentTabPanel = document.querySelector(`#${this.getAttribute("aria-controls")}`);
    $currentTabPanel.removeAttribute("hidden");

    $lastActiveTabBtn = this;
    $lastActiveTabPanel = $currentTabPanel;
});

// Keyboard accessibility for tab buttons
addEventOnElements($tabBtns, "keydown", function (e){
    const $nextElement = this.nextElementSibling;
    const $previousElement = this.previousElementSibling;

    if (e.key === "ArrowRight" && $nextElement) {
        this.setAttribute("tabindex", "-1");
        $nextElement.setAttribute("tabindex", "0");
        $nextElement.focus();
    } else if (e.key === "ArrowLeft" && $previousElement) {
        this.setAttribute("tabindex", "-1");
        $previousElement.setAttribute("tabindex", "0");
        $previousElement.focus();
    }
});


// WORK WITH APIs

// SEARCH
let apiUrl = `https://api.github.com/users/yash0102`;

const $searchSubmit = document.querySelector("[data-search-submit]");
let repoUrl, followerUrl, followingUrl = "";

const searchUser = () => {
    if(!$searchField.value) return;

    apiUrl = `https://api.github.com/users/${$searchField.value}`;
    updateProfile(apiUrl);
}

$searchSubmit.addEventListener("click", searchUser);

// Search when press Enter key
$searchField.addEventListener("keydown", (e) => {
    if(e.key === "Enter") searchUser();
})


// PROFILE
const $profileCard = document.querySelector("[data-profile-card]");
const $repoPanel = document.querySelector("[data-repo-panel]");
const $error = document.querySelector("[data-error]");
const repoTabBtn = document.querySelector("#tab-1");

let repoCount = 0;

window.updateProfile = (profileUrl) => {
    $error.style.display = "none";
    document.body.style.overflowY = "visible";

    $profileCard.innerHTML = `
        <div class="profile-skeleton">
            <div class="skeleton avatar-skeleton"></div>
            <div class="skeleton title-skeleton"></div>
            <div class="skeleton text-skeleton test-1"></div>
            <div class="skeleton text-skeleton test-2"></div>
            <div class="skeleton text-skeleton test-3"></div>
        </div>
    `;

    $tabBtns[0].click();

    $repoPanel.innerHTML = `
        <div class="card repo-skeleton">
            <div class="card-body">
                <div class="skeleton title-skeleton"></div>
                <div class="skeleton text-skeleton text-1"></div>
                <div class="skeleton text-skeleton text-2"></div>
            </div>
            <div class="card-footer">
                <div class="skeleton text-skeleton"></div>
                <div class="skeleton text-skeleton"></div>
                <div class="skeleton text-skeleton"></div>
            </div>
        </div>
    `.repeat(6);

    fetchData(profileUrl, (data) => {
        const {
            type,
            avatar_url, 
            name, 
            login: username,
            html_url: githubPage,
            bio,
            location,
            company,
            blog: website,
            twitter_username,
            public_repos,
            followers,
            following,
            follower_url,
            following_url,
            repos_url,
        } = data;

        repoUrl = repos_url;
        followerUrl = follower_url;
        followingUrl = following_url.replace("{/other_user}", "");
        repoCount = public_repos;

        repoTabBtn.innerHTML = `Repository (${numberToKilo(repoCount)})`;

        $profileCard.innerHTML = `
            <figure class="${type === "User" ? "avatar-circle" : "avatar-rounded"}  img-holder" style="--width: 280; --height: 280">
                <img src="${avatar_url}" alt="${username}" width="280" height="280" class="img-cover">
            </figure>

            ${name ? `<h1 class="title-2">${name}</h1>` : "" }

            <p class="username text-primary">${username}</p>
            ${bio ? `<p class="bio">${bio}</p>` : ""}

            <a href="${githubPage}" target="_blank" class="btn btn-secondary">
                <span class="material-symbols-rounded" aria-hidden="true">open_in_new</span>
                <span class="span">See on Github</span>
            </a>

            <ul class="profile-meta">
                ${location ? 
                    `<li class="meta-item">
                        <span class="material-symbols-rounded" aria-hidden="true">location_on</span>
                        <span class="meta-text">${location}</span>
                    </li>` : ""
                }

                ${company ?
                    `<li class="meta-item">
                        <span class="material-symbols-rounded" aria-hidden="true">apartment</span>
                        <span class="meta-text">${company}</span>
                    </li>` : ""
                }

                ${website ? 
                    `<li class="meta-item">
                        <span class="material-symbols-rounded" aria-hidden="true">captive_portal</span>
                        <a href="#" target="_blank" class="meta-text">${website.replace("https://", "")}</a>
                    </li>` : ""
                }

                ${twitter_username ?
                    `<li class="meta-item">
                        <span class="icon">
                            <i class="fa-brands fa-x-twitter fa-lg"></i>
                        </span>
                        <a href="https://twitter.com/${twitter_username}" target="_blank" class="meta-text">&nbsp;@${twitter_username}</a>
                    </li>` : ""
                }

            </ul>

            <ul class="profile-stats">
                
                <li class="stats-item">
                    <span class="body"> <i class="fa-regular fa-file-zipper fa-lg"></i>&nbsp; ${public_repos}</span> Repositories
                </li>
                <li class="stats-item">
                    <span class="body"><i class="fa-solid fa-user-group"></i>&nbsp; ${numberToKilo(followers)}</span> Followers.<span class="body">${numberToKilo(following)}</span> Following
                </li>
            </ul>

            <div class="footer">
                <p class="copyright">&copy; 2024 yash0102</p>
            </div>
        `;

        updateRepository();
    }, () => {
        $error.style.display = "grid";
        document.body.style.overflowY = "hidden";
    });
}

updateProfile(apiUrl);



// REPOSITORY
let forkedRepos = [];

const updateRepository = function () {
    fetchData(`${repoUrl}?sort=created&per_page=12`, function(data) {
        $repoPanel.innerHTML = `<h2 class="sr-only">Repositories</h2>`;
        forkedRepos = data.filter(item => item.fork );

        const repositories = data.filter(i => !i.fork);

        if (repositories.length) {
            for (const repo of repositories) {
                const {
                    name, 
                    html_url,
                    description,
                    private: isPrivate,
                    language,
                    stargazers_count: stars_count,
                    forks_count,
                } = repo;

                const $repoCard = document.createElement("article");
                $repoCard.classList.add("card", "repo-card");

                $repoCard.innerHTML = `
                <div class="card-body">
                    <a href="${html_url}" target="_blank" class="card-title">
                        <h3 class="title-3">${name}</h3>
                    </a>
                    ${description ? 
                        `<p class="card-text">${description}</p>` : ""
                    }

                    <span class="badge">${isPrivate ? "Private" : "Public"}</span>
                </div>

                <div class="card-footer">
                ${language ? 
                    `<div class="meta-item">
                        <span class="material-symbols-rounded" aria-hidden="true">code_blocks</span>
                        <span class="span">${language}</span>
                    </div>` : ""
                }
                    <div class="meta-item">
                        <span class="material-symbols-rounded" aria-hidden="true">star_rate</span>
                        <span class="span">${numberToKilo(stars_count)}</span>
                    </div>
                    <div class="meta-item">
                        <span class="material-symbols-rounded" aria-hidden="true">family_history</span>
                        <span class="span">${numberToKilo(forks_count)}</span>
                    </div>
                </div>
                `;

                $repoPanel.appendChild($repoCard);
            }
        } else {
            $repoPanel = `
            <div class="error-content">
                <p class="title-1">Oops! :(</p>
                <p class="text">
                    Doesn't have any public repositories yet.
                </p>
            </div>
            `
        }
    });
}