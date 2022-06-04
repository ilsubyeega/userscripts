// ==UserScript==
// @name         Block Joongonara VIP (네이버 카페)
// @namespace    https://userscripts.roto.win/
// @version      0.1
// @description  50개글 중 50개 전체가 VIP인건 좀 그렇지 않냐...
// @author       userscripts.roto.win
// @match        https://cafe.naver.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cafe.naver.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    if (g_sCafeHome === "https://cafe.naver.com/joonggonara") {
        /* 네이버 카페에서 게시글 목록과 게시글 검색이 따로 존재함 */
        removeVipOnTable(document.querySelector("#main-area > div:nth-child(4) > table > tbody"))
        removeVipOnTable(document.querySelector("#main-area > div.article-board.result-board.m-tcol-c > table > tbody"))
    }

    function removeVipOnTable(_tbody) {
        if (_tbody == null || ([..._tbody.children]).length == 0) return;

        const filtered = [..._tbody.children]
            .filter(a => a.querySelector("td.td_name > div > table > tbody > tr > td > span > img").src ===
                "https://cafe.pstatic.net/levelicon/1/1_150.gif")
        const _len = filtered.length

        filtered.forEach(a => a.remove())
        createUI(`💻 ${_len}개의 업자글을 제거하였습니다.`)
    }

    function createUI(_text) {
        const result = document.querySelector("#main-area > div.list-style")
        if (result == null) return;

        const element = document.createElement("div");
        element.appendChild(document.createTextNode(_text));
        element.style.margin = "18px 0 14px 0"
        element.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
        element.style.borderRadius = "40px";
        element.style.padding = "10px 20px";

        result.append(element)
    }
})();