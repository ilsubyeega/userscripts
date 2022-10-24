// ==UserScript==
// @name         DCInside-BView
// @namespace    http://roto.win/
// @version      202210240
// @description  url history fixes.
// @author       ilsubyeega
// @match        https://m.dcinside.com/board/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dcinside.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const log = (text) => console.log("%cDCInside-BView by ilsubyeega/userscripts%c \n" + text, "background-color: rgb(100, 149, 237); color: white; padding: 4px;", "")
    const warn = (text) => console.warn("%cDCInside-BView by ilsubyeega/userscripts%c \n" + text, "background-color: rgb(100, 149, 237); color: white; padding: 4px;", "")
    const error = (text) => console.error("%cDCInside-BView by ilsubyeega/userscripts%c \n" + text, "background-color: rgb(100, 149, 237); color: white; padding: 4px;", "")

    log("https://github.com/ilsubyeega/userscripts")

    const checkCurrentPagesUrlDepth = () => [...window.location.pathname].filter(a => a === "/").length
    const checkPathStartingWith = (path) => window.location.pathname.startsWith(path)

    const articleList = {
        // When you go to another page in the current article list, there are page parameters that prevent your browser from detecting whether it actually went to the article.
        // This allows the article to see inconsistencies in the content of the page shown below when on article page, but this will be leave it as a wontfix.
        fixUrl: () => {
            const gall = [...document.querySelector("body > div > div > div > section:nth-child(3)").children]?.filter(a => a.className === "gall-detail-lst")
            if (gall == null) {
                warn("Could not find gall node when replacing nodes. Trying again in 500ms.")
                setTimeout(articleList.watch, 500);
            }
            const childrens = gall.flatMap(a => [...a.children])
            childrens.map(a => a.querySelector("div > a.lt")).filter(a => a?.href != null).forEach(a => {
                // remove page query parameter from href
                const url = new URL(a.href);
                url.searchParams.delete("page");
                url.searchParams.delete("headid");
                url.searchParams.delete("recommended");
                a.href = url.href;
            })
        },
        watchWithObserver: () => {
            const gall = document.querySelector("body > div > div.sec-wrap-sub > div > section:nth-child(3)")
            if (gall == null) {
                warn("Could not find gall node when registering observer. Trying again in 500ms.")
                setTimeout(articleList.watchWithObserver, 500);
            }
            const observer = new MutationObserver((mutations) => {
                console.log("Triggered")
                articleList.fixUrl()
            })
            observer.observe(gall, {
                characterDataOldValue: true,
                subtree: true,
                childList: true,
                characterData: true
            })
        },
        init: () => {
            if (!checkPathStartingWith("/board/")) return
            if (checkCurrentPagesUrlDepth() != 2) return

            articleList.fixUrl()
            articleList.watchWithObserver()
            log("ArticleList: Sucessfully enabled urlfix.")
        }
    }

    articleList.init()
})();