import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
const Users = () => {
  const LIMIT = 10;
  const apiPath = "https://dummyjson.com/users";
  const [users, setUsers] = useState([]);
  const [activePage,setActivePage]=useState(1);

  const totalCount = 30;
  const getProductList = () => {
    // let pageNo = 2;
    let pageNo = Math.ceil(users.length / LIMIT) + 1; //0/10+1==1   //10/10+1==2
    const queryParam = "?page=" + pageNo + "&limit=" + LIMIT;
    const finalUrl = apiPath + queryParam;
    console.log({ finalUrl });

    axios
      .get(finalUrl,{
        params:{
            page:activePage,
            size:LIMIT
        }
      })
      .then((res) => {
        setActivePage(activePage +1);
        const apiRes = res.data.users;
        
        setUsers(apiRes);
        /*   const mergeData = [...users, ...apiRes];
        setUsers(mergeData);*/
      })
      .catch((error) => {
        console.error("error while fetching Data", error);
      });
  };

  useEffect(() => {
    getProductList();
  }, []);

  const fetchMoreData = () => {
    getProductList();
  };

  return (
    <>
      <h1>Employee</h1>
      <InfiniteScroll
        dataLength={users.length}
        next={fetchMoreData}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
         
          
            {users &&
              users.length > 0 &&
              users.map((user, index) => {
                return (
                  <>
                    <div key={user.id}>
                      <div>{user.id}</div>

                      <div>
                        <img src={user.image} height="100px" width="200px" />
                      </div>

                      <div>{`${user.firstName} ${user.maidenName} ${user.lastName}`}</div>
                      <div>{`${user.gender}/${user.age}`}</div>
                      <div>{user.company.title}</div>
                      <div>{`${user.address.state}, ${user.address.country}`}</div>
                    </div>
                  </>
                )
              })}
      
      </InfiniteScroll>
    </>
  );
};

export default Users;
