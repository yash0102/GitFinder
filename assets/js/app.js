'use strict';

import { fetchData } from "./api.js";

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
                    <span class="body"><i class="fa-solid fa-user-group"></i>&nbsp; ${followers}</span> Followers.<span class="body">${following}</span> Following
                </li>
            </ul>

            <div class="footer">
                <p class="copyright">&copy; 2024 yash0102</p>
            </div>
        `;
    }, () => {
        $error.style.display = "grid";
        document.body.style.overflowY = "hidden";
    });
}

updateProfile(apiUrl);