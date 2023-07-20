# react-google-map
본 레포지토리는 Google 에서 제공해주는 지도(Map)를 리액트에서 더 편리하게 사용할 수 있도록 도와주는 컴포넌트를 개발하기 위해 만들었습니다. 현재는 @react-google-maps/api 패키지를 사용한 컴포넌트를 제공하고 있지만, 추후에는 순수 Google 에서 제공해주는 map 관련 api 만을 사용한 컴포넌트도 개발할 계획에 있습니다.

<br />

# test
각 기능들 별로 별도의 테스트 페이지를 만들어 두었습니다. 본 프로젝트를 pull 받아 로컬에서 구동하시고 "http://localhost:3000" 에 접근하시면 각 테스트 페이지로 이동할 수 있는 버튼들이 표시됩니다.

<br />

# example code
예제 코드는 본 레포지토리의 src/app/test/* 경로를 참조해주세요.

<br />

# require key
본 레포지토리를 구동하기 위해 필요한 .env 내에 있어야 할 키-값 들은 다음과 같습니다. 
|key|value|
|---|---|
|NEXT_PUBLIC_GOOGLE_MAP_API_ID|구글맵 API ID (https://console.cloud.google.com/google/maps-apis/studio/maps 에서 관리하고 참조할 수 있습니다.)|
|NEXT_PUBLIC_GOOGLE_MAP_API_KEY|구글맵 API KEY (https://console.cloud.google.com/google/maps-apis/api-list 에서 "Maps JavaScript API" 을 활성화하신 후 https://console.cloud.google.com/google/maps-apis/credentials 에서 Key 를 생성하시면 됩니다.)|
|NEXT_PUBLIC_GEO_JSON_URL|geo json 파일 주소|

