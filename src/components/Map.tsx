import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectedAddress, setAddressList } from "../../redux/maps"
import axios from "axios"

const marker = new window.kakao.maps.Marker()
const infowindow = new window.kakao.maps.InfoWindow({ zindex: 1 })
const Map = () => {
  const { addresss, addressList } = useSelector((state) => state.maps)
  const dispatch = useDispatch()
  const [location, setLocation] = useState({ lat: 0, lng: 0 })
  const [address, setAddress] = useState("전북 삼성동 100")
  const { kakao } = window
  const container = useRef()
  const map = useRef()

  const geocoder = new kakao.maps.services.Geocoder()
  const options = {
    center: new kakao.maps.LatLng(location.lat, location.lng),
    level: 5,
  }
  function searchAddrFromCoords(coords, callback) {
    // 좌표로 행정동 주소 정보를 요청합니다
    geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback)
  }
  function searchDetailAddrFromCoords(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback)
  }

  // function displayCenterInfo(result, status) {
  //   if (status === kakao.maps.services.Status.OK) {
  //     var infoDiv = document.getElementById("centerAddr")

  //     for (var i = 0; i < result.length; i++) {
  //       // 행정동의 region_type 값은 'H' 이므로
  //       if (result[i].region_type === "H") {
  //         infoDiv.innerHTML = result[i].address_name
  //         break
  //       }
  //     }
  //   }
  // }

  const showDetailAddrFromCoords = (result, event) => {
    let coords = new kakao.maps.LatLng(result[0].y, result[0].x)
    if (event) coords = event.latLng
    marker.setPosition(coords)
    marker.setMap(map.current)
    let detailAddr = !!result[0].road_address
      ? "<div>도로명주소 : " + result[0].road_address.address_name + "</div>"
      : ""
    detailAddr +=
      "<div>지번 주소 : " + result[0].address.address_name + "</div>"

    let content = `<div class="bAddr">
                    <span class="title">법정동 주소정보</span> ${detailAddr}
                    <button id='infowindow-button'>이 주소로 배송할래요!</button>
                  </div>`
    infowindow.setContent(content)
    infowindow.open(map.current, marker)
    const test = document.getElementById("infowindow-button")
    test.addEventListener("click", () => {
      dispatch(selectedAddress(result[0].address.address_name))
      // close modal
    })
    map.current.setCenter(coords)
  }
  const request = async () => {
    const response = await axios.get(
      "https://dapi.kakao.com/v2/local/search/address.json",
      {
        params: { query: address },

        headers: {
          Authorization: `KakaoAK ${import.meta.env.VITE_REST_API_KEY}`,
        },
      }
    )
    if (response.status === 200) {
      dispatch(setAddressList(response.data.documents))
    }
  }
  useEffect(() => {
    // 이거 이전것들은 지울 수 있나?
    geocoder.addressSearch(addresss, (res, status) => {
      if (status === kakao.maps.services.Status.OK) {
        showDetailAddrFromCoords(res, null)
      }
    })
    // console.log("addresss", addresss)
  }, [addresss])
  useEffect(() => {
    request()
  }, [address])
  useEffect(() => {
    map.current = new kakao.maps.Map(container.current, options)
    geocoder.addressSearch("전북 삼성동 100", (res, status) => {
      if (status === kakao.maps.services.Status.OK) {
        showDetailAddrFromCoords(res, null)
      }
    })
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("position", position)
        let lat = position.coords.latitude
        let lng = position.coords.longitude
        let locPosition = new kakao.maps.LatLng(lat, lng)
        marker.setPosition(locPosition)
        marker.setMap(map.current)
        // infowindow.open(map.current, marker)
        map.current.setCenter(locPosition)
      })
    }
    // searchAddrFromCoords(map.current.getCenter(), displayCenterInfo)
    // searchAddrFromCoords(map.getCenter(), displayCenterInfo)
    kakao.maps.event.addListener(map.current, "click", function (mouseEvent) {
      searchDetailAddrFromCoords(mouseEvent.latLng, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          showDetailAddrFromCoords(result, mouseEvent)
        }
      })
    })
    // kakao.maps.event.addListener(map.current, "idle", function () {
    //   searchAddrFromCoords(map.current.getCenter(), displayCenterInfo)
    // })
  }, [])

  return (
    <div className="map-container">
      <div>
        <input type="text" onChange={(e) => setAddress(e.target.value)} />
        <ul>
          {addressList.map((address, index) => (
            <li
              onClick={() => dispatch(selectedAddress(address.address_name))}
              key={index}
            >
              {address.address.address_name}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ height: "100%" }} ref={container} id="map"></div>
    </div>
  )
}

export default Map
