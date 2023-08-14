/* 전체적인 틀 */
function openMenu() {
    document.getElementById("map").style.marginLeft = "350px";
    document.querySelector('.sidebar').style.width = "350px";
    document.querySelector('.sidebar').style.zIndex = "111";
    document.querySelector('.openbtn').style.display = 'none';
    document.getElementById("map").style.height = "963px";
}

function closeMenu() {
    document.getElementById("map").style.margin = "0";
    document.querySelector('.sidebar').style.width = "0";
    document.querySelector('.openbtn').style.display = 'block';
}

function openslide() {
    // explore 요소 선택
    var exploreBtns = document.querySelectorAll('.explore');

    // 각 explorebtn 요소의 위치를 변경하고 애니메이션을 적용합니다.
    exploreBtns.forEach(function (btn) {
        btn.style.left = '50px'; 
    });
}

function closeslide() {
    // explorebtn 요소들을 선택합니다.
    var exploreBtns = document.querySelectorAll('.explore');

    exploreBtns.forEach(function (btn) {
        btn.style.left = '170px'; 
    });
}

/*현재 위치로 중심 이동*/
function now() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude,
                lng = position.coords.longitude;
    
            var NowPosition = new kakao.maps.LatLng(lat, lng);

            setCenter(NowPosition);
            map.panTo(NowPosition);
    
        });
    }
}


// --- 여기까지 메뉴 부분 --- //

// --- 여기서부터 간단한 기능 함수 --- //

/* 지도 중심좌표 설정 */
function setCenter(locPosition) {
    map.setCenter(locPosition);
}

/* 지도 부드럽게 이동 */
function panTo() {
    map.panTo(NowPosition);
}

/* 시작화면으로 이동 */
function start(url) {
    window.location.href = url;
}

/* 인포윈도우 open */
function mouseOverListener(map, marker, infoWindow) {
    return function () {
        infoWindow.open(map, marker);
    };
}
/* 인포윈도우 close */
function mouseOutListener(infoWindow) {
    return function () {
        infoWindow.close();
    };
}

function Homereset() {
    document.getElementById('three').style.display = 'none';
    reset();
    removeMarkers();
    now();
    data();
}

/* 마커 제거 */
function removeMarkers() {
    clusterer.clear(); // 클러스터 해제
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}
/* 리스트 리셋 */
function reset() {
    var new_two = document.getElementById('two');
    new_two.innerHTML = "";
}


/* ---- 기능코드 ---- */

/* 검색결과 표시 */
function displayMarker(searchResult) {

    removeMarkers();

    for (let i = 0; i < searchResult.length; i++) {
        var lng = searchResult[i]["mapx"];
        var lat = searchResult[i]["mapy"];

        var marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(lat, lng),
            map: map,
        });

        var content = document.createElement('div');
        content.innerHTML = '&nbsp;' + searchResult[i]["title"];

        content.style.width = "400px";

        var infoWindow = new kakao.maps.InfoWindow({
            content: content,
        })

        kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
        kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
        (function (index) {
            kakao.maps.event.addListener(marker, 'click', function () {
                details(searchResult, index);
                openMenu();
                openslide();
            });
        })(i);

        clusterer.addMarker(marker);

    }
}


function searchPlaces() {
    const keywordInput = document.getElementById("keyword");
    const keyword = keywordInput.value;

    if (keyword === "") {
        return;
    }

    fetch(bf_data)
        .then((response) => response.json())
        .then((resJson) => {
            const location = resJson.anwkddo.body.items.data;
            const titles = location.map((item) => item.title);

            let matchingIndexes = [];
            let matchingCode = "";
            let firstMatchingIndex = null; // 첫 번째 일치하는 인덱스

            for (let i = 0; i < titles.length; i++) {
                if (titles[i] === keyword) {
                    matchingIndexes.push(i);
                    if (firstMatchingIndex === null) {
                        firstMatchingIndex = i; 
                        matchingCode = location[i].code;
                    }
                } else if (titles[i].includes(keyword)) {
                    matchingIndexes.push(i);
                }
            }

            let searchResult = [];
            if (matchingIndexes.length > 0) {
                if (matchingCode !== "") {
                    searchResult = location.filter((item) => item.code === matchingCode);
                } else {
                    searchResult = matchingIndexes.map((index) => location[index]);
                }

                // 첫 번째 일치하는 인덱스의 데이터를 제일 처음으로 이동
                if (firstMatchingIndex !== null) {
                    const firstMatchingData = location[firstMatchingIndex];
                    searchResult.unshift(firstMatchingData);
                }

                const mapx = searchResult[0].mapx;
                const mapy = searchResult[0].mapy;
                NowPosition = new kakao.maps.LatLng(mapy, mapx);

                setCenter(NowPosition);
                map.panTo(NowPosition);

                let dataHTML = "";

                for (let i = 0; i < searchResult.length; i++) {
                    const currentIndex = matchingIndexes[i] || firstMatchingIndex;
                    dataHTML +=
                        '<div id="data-' +
                        currentIndex +
                        '"><img src="' +
                        searchResult[i].firstimage +
                        '" alt="' +
                        searchResult[i].title +
                        '" width="300" height="180"><br>' +
                        '<h2 style="display:inline">' +
                        searchResult[i].title +
                        '&nbsp;&nbsp;</h2>' +
                        '<img class="bookmark" src="media/bookmark1.png" alt="Bookmark" width="25" height="25" style="cursor: pointer;"><br>' +
                        '<h4 style="display:inline; font-weight:normal;">  tel: ' +
                        searchResult[i].tel +
                        '</h5><br>' +
                        searchResult[i].addr1 +
                        searchResult[i].addr2 +
                        "(" +
                        searchResult[i].zipcode +
                        ')</div><br><hr>';
                }

                dataPane.innerHTML = dataHTML;

                const bookmarks = document.getElementsByClassName('bookmark');
                for (let i = 0; i < bookmarks.length; i++) {
                    bookmarks[i].addEventListener('click', function () {
                        bookmark_click(location, matchingIndexes[i] || firstMatchingIndex);
                    });
                }

                displayMarker(searchResult);
            } else {
                dataPane.innerText = "일치하는 데이터가 없습니다.";
            }
            keywordInput.value = "";
        })
        .catch((error) => {
            console.log(error);
        });
}

var bookmarksave = []; // 전역변수로 선언

function bookmark_click(bookmarkdata, i) {
    alert("북마크에 저장!");

    var book_title = bookmarkdata[i]["title"];
    var book_addr = bookmarkdata[i]["addr1"];
    var lng = bookmarkdata[i]["mapx"];
    var lat = bookmarkdata[i]["mapy"];
    var i = i;

    var array = [book_title, book_addr, lng, lat, i];
    bookmarksave.push(array);

    var bookmarkList = document.getElementById('three');
    bookmarkList.innerHTML = '';

    bookmarksave.forEach(function (bookmark, index) {
        var bookmarkItem = document.createElement('div');
        var bookmarkIndex = document.createElement('span');
        bookmarkIndex.innerText = "[" + (index + 1) + "]";
        var bookmarkTitle = document.createElement('strong');
        bookmarkTitle.innerText = bookmark[0];
        var bookmarkAddress = document.createElement('span');
        bookmarkAddress.innerHTML = "<br>(" + bookmark[1] + ")";
        bookmarkItem.style.marginBottom = '10px';
        bookmarkItem.appendChild(bookmarkIndex);
        bookmarkItem.appendChild(bookmarkTitle);
        bookmarkItem.appendChild(bookmarkAddress);
        bookmarkList.appendChild(bookmarkItem);
    });
}

function bookmark_marker(title, lng, lat, location, i) {
    var marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng),
        map: map,
    });

    var infoWindow = new kakao.maps.InfoWindow({
        removable: true,
        content: title
    });

    markers.push(marker);

    kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
    kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
    (function (i) {
        kakao.maps.event.addListener(marker, 'click', function () {
            details(location, i);
            openMenu();
            openslide();
        });
    })(i);
}

/* 북마크 리스트 보여주는 함수 */
function showBookmarkList() {
    reset();
    removeMarkers();
    var bookmarkList = document.getElementById('three');
    bookmarkList.style.display = 'block';

    fetch(bf_data)
        .then((response) => response.json())
        .then((resJson) => {
            var markers = [];
            var location = resJson.anwkddo.body.items.data;

            for (let i = 0; i < bookmarksave.length; i++) {
                for (let j = 0; j < bookmarksave.length; j += 4) {
                    title = bookmarksave[i][j];
                    lng = bookmarksave[i][j + 2];
                    lat = bookmarksave[i][j + 3];
                    index = bookmarksave[i][j + 4];

                    bookmark_marker(title, lng, lat, location, index);
                }
            }
            P_center(bookmarksave[0][3], bookmarksave[0][2]);

            clusterer.addMarkers(markers);
        });

}

function closeBookmarkList() {
    reset();
    document.getElementById('three').style.display = 'none';

}

/* 각 장소의 상세설명 */
function details(location, i) {

    closeBookmarkList();
    var dataList = document.getElementById('two');
    dataList.innerHTML = '<div><img src="' + location[i]["firstimage"] + '" alt="' + location[i]["title"] + '" width="300" height="180"><br>' +
        '<h2 style="display:inline">' + location[i]["title"] + '&nbsp;&nbsp;</h2>' +
        '<br><h4 style="display:inline; font-weight:normal;">  tel: ' + location[i]["tel"] + '</h5><br>' +
        '<br>- 운영시간<br>' + location[i]["time"] + '<br><br>- 이용 요금<br>' + location[i]["fee"] +
        '<br><br>- 수유실 유무: ' + location[i]["suyusil"] + '<br>- 장애인 주차 시설 유무: ' + location[i]["parking"] + '<br>- 장애인 화장실 유무: ' + location[i]["toilet"] +
        '<br>- 기타 정보: ' + location[i]["etc"] +'</div>';

    var bookmark = document.createElement('img');
    bookmark.src = "media/bookmark1.png";
    bookmark.style.cursor = "pointer";
    bookmark.style.width = "25px"; 
    bookmark.style.height = "25px";
    bookmark.style.left = "20px";
    bookmark.style.top = "33px";

    var h2Wrapper = document.querySelector('#two h2');
    h2Wrapper.insertAdjacentElement('afterend', bookmark);

    bookmark.addEventListener('click', function () {
        bookmark_click(location, i);
    });
}

/* 공공데이터 불러오기 */
function data() {
    fetch(bf_data)
        .then((response) => response.json())
        .then((resJson) => {
            var markers = [];
            var location = resJson.anwkddo.body.items.data;

            makemarker(markers, location);
            clusterer.addMarkers(markers);
        });
}

/*전체 마커 표시 */
function makemarker(markers, location) {
    removeMarkers();
    for (var i = 0; i < location.length; i++) {
        var lng = location[i]["mapx"]; 
        var lat = location[i]["mapy"]; 

        var marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(lat, lng),
            map: map,
        });

        var content = document.createElement('div');
        content.innerHTML = '&nbsp;' + location[i]["title"] + '<br>&nbsp;&nbsp;' + location[i]['addr1'] + location[i]['addr2'] + '(' + location[i]['zipcode'] + ')';
        content.style.width = "400px";

        var infoWindow = new kakao.maps.InfoWindow({
            removable: true,
            content: content

        });

        markers.push(marker);

        kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
        kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
        (function (i) {
            kakao.maps.event.addListener(marker, 'click', function () {
                details(location, i);
                openMenu();
                openslide();
            });
        })(i);
    }
}

// --------------------------------------------//

function charge() {
    reset();
    removeMarkers();

    fetch(charge_data)
        .then((response) => response.json())
        .then((resJson) => {


            var location = resJson.getTblDischrgStusInfo.body.items.item;

            for (var i = 0; i < location.length; i++) {
                var lng = location[i]["lng"];  //경도
                var lat = location[i]["lat"];  //위도


                var imageSrc = "https://cdn.discordapp.com/attachments/1107729965455249529/1114537033721978991/charge_marker.png", // 마커이미지 주소   
                    imageSize = new kakao.maps.Size(50, 54), // 마커이미지 크기
                    imageOption = { offset: new kakao.maps.Point(25, 50) }; // 마커이미지 옵션


                var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
                var markerPosition = new kakao.maps.LatLng(lat, lng); // 마커가 표시될 위치


                var marker = new kakao.maps.Marker({
                    position: markerPosition,
                    image: markerImage // 마커이미지 설정 
                });

                var content = document.createElement('div');
                content.innerHTML = "&nbsp" + location[i]["loc"] + '<br>&nbsp&nbsp' + location[i]['addr'];
                content.style.width = "400px";

                var infoWindow = new kakao.maps.InfoWindow({
                    content: content,
                })


                markers.push(marker);


                marker.setMap(map);

                kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
                kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
                (function (i) {
                    kakao.maps.event.addListener(marker, 'click', function () {
                        charge_details(location, i);
                        openMenu();
                        openslide();
                    });
                })(i);
            }
            clusterer.addMarkers(markers);
        });
}
/* 휠체어 충전소 데이터 */
function hospital() {
    reset();
    removeMarkers();
    fetch(hospital_data)
        .then((response) => response.json())
        .then((resJson) => {


            var location = resJson.MedicalInstitInfo.body.items.item;

            for (var i = 0; i < location.length; i++) {
                var lng = location[i]["lng"];  //경도
                var lat = location[i]["lat"];  //위도

                var imageSrc = "https://cdn.discordapp.com/attachments/1107729965455249529/1114537084070396056/hospital_marker.png",
                    imageSize = new kakao.maps.Size(42, 44),
                    imageOption = { offset: new kakao.maps.Point(25, 50) };

                var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
                var markerPosition = new kakao.maps.LatLng(lat, lng);
                var marker = new kakao.maps.Marker({
                    position: markerPosition,
                    image: markerImage
                });

                var content = document.createElement('div');
                content.innerHTML = "&nbsp" + location[i]["instit_nm"] + '<br>&nbsp&nbsp' + location[i]['street_nm_addr'];
                content.style.width = "400px";

                var infoWindow = new kakao.maps.InfoWindow({
                    content: content,
                })


                markers.push(marker);
                marker.setMap(map);

                kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
                kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
                (function (i) {
                    kakao.maps.event.addListener(marker, 'click', function () {
                        hospital_details(location, i);
                        openMenu();
                        openslide();
                    });
                })(i);
            }
            clusterer.addMarkers(markers);
        });
}


function hospital_check(n) {
    reset();
    removeMarkers();
    fetch(hospital_data)
        .then((response) => response.json())
        .then((resJson) => {

            var location = resJson.MedicalInstitInfo.body.items.item;

            for (var i = 0; i < location.length; i++) {
                if (location[i]["exam_part"].includes(n)) {
                    var lng = location[i]["lng"];  
                    var lat = location[i]["lat"];  
                  
                    var imageSrc = "https://cdn.discordapp.com/attachments/1107729965455249529/1114537084070396056/hospital_marker.png",  
                        imageSize = new kakao.maps.Size(42, 44),
                        imageOption = { offset: new kakao.maps.Point(25, 50) }; 

                    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
                    var markerPosition = new kakao.maps.LatLng(lat, lng); 
                    var marker = new kakao.maps.Marker({
                        position: markerPosition,
                        image: markerImage 
                    });

                    var content = document.createElement('div');
                    content.innerHTML = "&nbsp" + location[i]["instit_nm"] + '<br>&nbsp&nbsp' + location[i]['street_nm_addr'] + '(' + location[i]['zip_code'] + ')';
                    content.style.width = "400px";

                    var infoWindow = new kakao.maps.InfoWindow({
                        content: content,
                    })

                    markers.push(marker);
                    marker.setMap(map);

                    // 마커 이벤트리스너 
                    kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
                    kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
                    (function (i) {
                        kakao.maps.event.addListener(marker, 'click', function () {
                            hospital_details(location, i);
                            openMenu();
                            openslide();
                        });
                    })(i);
                }
            }
            clusterer.addMarkers(markers);
        });
}

/* 약국 데이터 */
function pharmacy() {
    reset();
    removeMarkers();
    fetch(pharmacy_data)
        .then((response) => response.json())
        .then((resJson) => {


            var location = resJson.MedicalInstitInfo.body.items.item;

            for (var i = 0; i < location.length; i++) {
                var lng = location[i]["lng"];  
                var lat = location[i]["lat"];  

                var imageSrc = "https://cdn.discordapp.com/attachments/1107729965455249529/1114537084070396056/hospital_marker.png",   
                    imageSize = new kakao.maps.Size(42, 44), 
                    imageOption = { offset: new kakao.maps.Point(25, 50) }; 
                var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
                var markerPosition = new kakao.maps.LatLng(lat, lng); 

                var marker = new kakao.maps.Marker({
                    position: markerPosition,
                    image: markerImage 
                });

                var content = document.createElement('div');
                content.innerHTML = "&nbsp" + location[i]["instit_nm"] + '<br>&nbsp&nbsp' + location[i]['street_nm_addr'];
                content.style.width = "400px";

                var infoWindow = new kakao.maps.InfoWindow({
                    content: content,
                })

                markers.push(marker);
                marker.setMap(map);

                kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
                kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
                (function (i) {
                    kakao.maps.event.addListener(marker, 'click', function () {
                        pharmacy_details(location, i);
                        openMenu();
                        openslide();
                    });
                })(i);
            }
            clusterer.addMarkers(markers);
        });
}


function pharmacy_check(n) {
    reset();
    removeMarkers();
    fetch(pharmacy_data)
        .then((response) => response.json())
        .then((resJson) => {
    

            var location = resJson.MedicalInstitInfo.body.items.item;

            for (var i = 0; i < location.length; i++) {
                if (location[i]["street_nm_addr"].includes(n)) {
                    var lng = location[i]["lng"];  
                    var lat = location[i]["lat"];  

                    var imageSrc = "https://cdn.discordapp.com/attachments/1107729965455249529/1114537084070396056/hospital_marker.png",  
                        imageSize = new kakao.maps.Size(42, 44),
                        imageOption = { offset: new kakao.maps.Point(25, 50) }; 

                    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
                    var markerPosition = new kakao.maps.LatLng(lat, lng); 

                    var marker = new kakao.maps.Marker({
                        position: markerPosition,
                        image: markerImage 
                    });

                    var content = document.createElement('div');
                    content.innerHTML = "&nbsp" + location[i]["instit_nm"] + '<br>&nbsp&nbsp' + location[i]['street_nm_addr'] + '(' + location[i]['zip_code'] + ')';
                    content.style.width = "400px";

                    var infoWindow = new kakao.maps.InfoWindow({
                        content: content,
                    })

                    markers.push(marker);
                    marker.setMap(map);

            
                    kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
                    kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
                    (function (i) {
                        kakao.maps.event.addListener(marker, 'click', function () {
                            pharmacy_details(location, i);
                            openMenu();
                            openslide();
                        });
                    })(i);
                }
            }
            clusterer.addMarkers(markers);
        });
}

function P_center(a, b) {
    var newCenter = new kakao.maps.LatLng(a, b);
    map.setCenter(newCenter);
}
/* 수유실 데이터 */
function milk() {
    reset();
    removeMarkers();

    fetch(milk_data)
        .then((response) => response.json())
        .then((resJson) => {

            var location = resJson.getNursingroomInfo.body.items.item;
    

            for (var i = 0; i < location.length; i++) {
                var lng = location[i]["lng"];  
                var lat = location[i]["lat"];  

                var imageSrc = "https://cdn.discordapp.com/attachments/1107729965455249529/1114536009904967781/baby_marker.png", 
                    imageSize = new kakao.maps.Size(27, 42),
                    imageOption = { offset: new kakao.maps.Point(0, 80) }; 

                var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
                var markerPosition = new kakao.maps.LatLng(lat, lng); 

                var marker = new kakao.maps.Marker({
                    position: markerPosition,
                    image: markerImage 
                });

                var content = document.createElement('div');
                content.innerHTML = "&nbsp" + location[i]["sj"] + '<br>&nbsp&nbsp' + location[i]['address'] + ', ' + location[i]['place'];
                content.style.width = "400px";

                var infoWindow = new kakao.maps.InfoWindow({
                    content: content,
                })

                markers.push(marker);

                marker.setMap(map);

                kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
                kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
                (function (i) {
                    kakao.maps.event.addListener(marker, 'click', function () {
                        milk_details(location, i);
                        openMenu();
                        openslide();
                    });
                })(i);
            }
            clusterer.addMarkers(markers);
        });
}



/* 충전소 */
function charge_details(location, i) {
    var new_two = document.getElementById('two');
    new_two.innerHTML =
        '<div><h2 style = "display:inline">' + location[i]["loc"] + '</h2>' +
        '<br><h4 style = "display:inline; font-weight:normal;">  tel: ' + location[i]["tel"] + '</h5><br>' +
        location[i]["addr"] + '</div>';
}
/* 병원 */
function hospital_details(location, i) {
    var new_two = document.getElementById('two');
    new_two.innerHTML =
        '<div><h2 style = "display:inline">' + location[i]["instit_nm"] + '</h2>' +
        '<br><h4 style = "display:inline; font-weight:normal;">  tel: ' + location[i]["tel"] + '</h5><br>' +
        location[i]["street_nm_addr"]
        + '<br><br>진료 과목: <br>' + location[i]["exam_part"]
        + '</div>';

}
/* 약국 */
function pharmacy_details(location, i) {
    var new_two = document.getElementById('two');
    new_two.innerHTML = '<div>' +
        '<h2 style = "display:inline">' + location[i]["instit_nm"] + '</h2>' +
        '<br><h4 style = "display:inline; font-weight:normal;">  tel: ' + location[i]["tel"] + '</h5><br>' +
        location[i]["street_nm_addr"]
        + '<br><br>일요일 ' + location[i]["Sunday"]
        + '<br>월요일 ' + location[i]["Monday"]
        + '<br>화요일 ' + location[i]["Tuesday"]
        + '<br>수요일 ' + location[i]["Wednesday"]
        + '<br>목요일 ' + location[i]["Thursday"]
        + '<br>금요일 ' + location[i]["Friday"]
        + '<br>토요일 ' + location[i]["Saturday"]
        + '<br>공휴일 ' + location[i]["holiday"]

        + '</div>';
}

/* 수유실 */
function milk_details(location, i) {
    var new_two = document.getElementById('two');
    new_two.innerHTML =
        '<div><h2 style = "display:inline">' + location[i]["sj"] + '</h2>' +
        '<br><h4 style = "display:inline; font-weight:normal;">  tel: ' + location[i]["tel"] + '</h5><br>' +
        location[i]["address"] + ', ' + location[i]["place"] +
        '<br><br>대상: ' + location[i]["target"] + '<br>' +
        '유아 동반 남성 출입' + location[i]["father"]

        + '</div>';
}

/*인기 관광지*/
function popular_fetch(i) {
    fetch(popular)
        .then((response) => response.json())
        .then((resJson) => {
            var markers = [];

            var location = resJson.anwkddo.body.items.data;
            var lng = location[i]["mapx"];  //경도
            var lat = location[i]["mapy"];  //위도
            var marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(lat, lng),
                map: map,
            });

            var content = document.createElement('div');
            content.innerHTML = '&nbsp' + location[i]["title"] + '<br>&nbsp&nbsp' + location[i]['addr1'] + location[i]['addr2'] + '(' + location[i]['zipcode'] + ')';
            content.style.width = "400px";

            var infoWindow = new kakao.maps.InfoWindow({
                content: content,
            })

            markers.push(marker);
        
            kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
            kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));

            kakao.maps.event.addListener(marker, 'click', function () {
                details(location, i);
                openMenu();
                openslide();
            });

            clusterer.addMarkers(markers);
        });
}


function popular1() {
    popular_fetch(0)
}

function popular2() {
    popular_fetch(1)
}

function popular3() {
    popular_fetch(2)
}

function popular4() {
    popular_fetch(3)
}