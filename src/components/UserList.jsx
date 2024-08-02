import React, { useEffect, useState } from "react";
import axios from "axios";

import InfiniteScroll from "react-infinite-scroll-component";

import { IoIosArrowRoundDown } from "react-icons/io";
import { GoArrowUp } from "react-icons/go";
const UserList = () => {
  const [users, setUsers] = useState([]);

  //sorting part
  let [order, setOrder] = useState("asc");
//filtering
  const [filterGender, setFilterGender] = useState("");
  const [filterCountry, setFilterCountry] = useState("");

  //sorting
  let field = "";
  let sorting = (field) => {
    if (order === "asc") {
      const sorted = [...users].sort((a, b) => (a[field] > b[field] ? 1 : -1));
      setUsers(sorted);
      setOrder("dsc");
    }
    if (order === "dsc") {
      const sorted = [...users].sort((a, b) => (a[field] < b[field] ? 1 : -1));
      setUsers(sorted);
      setOrder("asc");
    }
  };

  //!infinit scrolling
  const totalCount = 208;
  const PAGE_LIMIT = 10; //!each page limit is 10
  const Base_Url = "https://dummyjson.com/users";

  //fetching data
  const getApi = async () => {
    let pageNo = Math.ceil(users.length / PAGE_LIMIT); //0/10=0  //10/10=1
    //   console.log( pageNo);

    axios
      .get(Base_Url, {
        //
        params: {
          limit: PAGE_LIMIT,
          skip: pageNo * PAGE_LIMIT,
        },
      })
      .then((res) => {
        const apiRes = res.data.users;

        const mergeData = [...users, ...apiRes];
        setUsers(mergeData);
        console.log(mergeData);
      })
      .catch((error) => {
        console.error("error while fetching data", error);
      });
  };

  useEffect(() => {
    getApi();
  }, []);

  const fetchMoreData = () => {
    getApi();
  };

  //!filtering
  const handleGenderFilter = (e) => {
    setFilterGender(e.target.value);
  };

  // Function to handle filtering by country
  const handleCountryFilter = (e) => {
    setFilterCountry(e.target.value);
  };

    // Apply gender filter
  const filteredUsers = users.filter((user) => {
    return !filterGender || user.gender === filterGender;
    console.log(filteredUsers);
  });


  return (
    <>
     <div className="start"> 
      <h1>Employees</h1>
      &nbsp;
      <span className="filter">
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="brown"
              d="M21 3H5a1 1 0 0 0-1 1v2.59c0 .523.213 1.037.583 1.407L10 13.414V21a1.002 1.002 0 0 0 1.447.895l4-2c.339-.17.553-.516.553-.895v-5.586l5.417-5.417c.37-.37.583-.884.583-1.407V4a1 1 0 0 0-1-1Zm-6.707 9.293A.997.997 0 0 0 14 13v5.382l-2 1V13a.996.996 0 0 0-.293-.707L6 6.59V5h14.001l.002 1.583-5.71 5.71Z"
            ></path>
          </svg>
        </button>
      </span>
      <select value={filterCountry} onChange={handleCountryFilter}>
        <option value="">Country</option>
        <option value="United states">United states</option>
        <option value="United states">Canada</option>
      </select> &nbsp; &nbsp;
      &nbsp;
      <select value={filterGender} onChange={handleGenderFilter}>
        <option value="">Gender</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
      </select>
      </div>
 <hr />

      <div className="row">
        <InfiniteScroll
          dataLength={users.length} //how many product load till now
          next={fetchMoreData}
          hasMore={users.length < totalCount}
          loader={<h4>Loading...</h4>}
          endMessage={<p>No more items to load</p>} //condition for  last item
        >
          <table className="tableContainer mt-3">
            <thead>
              <tr>
                <th>
                  ID{" "}
                  <button onClick={() => sorting("id")}>
                    {order === "asc" ? <IoIosArrowRoundDown /> : <GoArrowUp />}
                  </button>
                </th>

                <th>Image</th>
                <th>
                  FullName
                  <button onClick={() => sorting("firstName")}>
                    {order === "asc" ? <IoIosArrowRoundDown /> : <GoArrowUp />}
                  </button>
                </th>
                <th>
                  Demography
                  <button onClick={() => sorting("gender")}>
                    {order === "asc" ? <IoIosArrowRoundDown /> : <GoArrowUp />}
                  </button>
                </th>
                <th>Designation</th>
                <th>
                  Location
                  
                </th>
             
              </tr>
              
            </thead>
            <hr />
            <tbody>
              {users.map((x, index) => (
                <tr key={x.id}>
                  <td>{x.id}</td>

                  <td>
                    <img src={x.image} height="100px" width="200px" />
                  </td>
                  <td>{x.firstName + " " + x.maidenName + " " + x.lastName}</td>
                  <td>{x.gender + "/" + x.age}</td>
                  <td>{x.company.title}</td>
                  <td>{x.address.state + " ," + x.address.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </>
  );
};

export default UserList;
