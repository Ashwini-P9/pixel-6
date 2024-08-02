import React, { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const EmployeeList = () => {
  const [users, setUsers] = useState([]);
  const [filterGender, setFilterGender] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [sortBy, setSortBy] = useState({ field: "", order: "asc" });

  const PAGE_LIMIT = 10;
  const Base_Url = "https://dummyjson.com/users";

  const fetchUsers = async (page) => {
    try {
      const response = await axios.get(Base_Url, {
        params: {
          limit: PAGE_LIMIT,
          skip: page * PAGE_LIMIT,
        },
      });
      return response.data.users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  const getUsers = async (page) => {
    const fetchedUsers = await fetchUsers(page);
    setUsers((prevUsers) => [...prevUsers, ...fetchedUsers]);
  };

  useEffect(() => {
    getUsers(0); // Initial fetch when component mounts
  }, []); // Empty dependency array means it runs only once on mount

  const fetchMoreData = () => {
    getUsers(Math.floor(users.length / PAGE_LIMIT));
  };

   

  const handleSort = (field) => {
    let newOrder = "asc";
    if (sortBy.field === field && sortBy.order === "asc") {
      newOrder = "desc";
    }
    setSortBy({ field, order: newOrder });

    // Sorting users array based on selected field and order
    const sortedUsers = [...users].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      if (newOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setUsers(sortedUsers);
  };

  const handleFilterGender = (event) => {
    setFilterGender(event.target.value);
  };

  const handleFilterCountry = (event) => {
    setFilterCountry(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    if (filterGender && user.gender !== filterGender) return false;
    if (filterCountry && user.address.country !== filterCountry) return false;
    return true;
  });

  return (
    <>
      <h1>Employees</h1>
      <div className="filters">
        <span className="filter">
          <select value={filterCountry} onChange={handleFilterCountry}>
            <option value="">Country</option>
            <option value="United States">United States</option>
            {/* Add more countries as needed */}
          </select>
        </span>
        <span className="filter">
          <select value={filterGender} onChange={handleFilterGender}>
            <option value="">Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </span>
      </div>

      <div className="row">
        <InfiniteScroll
          dataLength={filteredUsers.length}
          next={fetchMoreData}
          hasMore={true} // You need to implement logic to determine if there are more pages to load
          loader={<h4>Loading...</h4>}
          endMessage={<p>No more items to load</p>}
        >
          <table className="tableContainer mt-3">
            <thead>
              <tr>
                <th onClick={() => handleSort("id")}>ID</th>
                <th>Image</th>
                <th onClick={() => handleSort("fullName")}>Full Name</th>
                <th onClick={() => handleSort("gender")}>Gender</th>
                <th onClick={() => handleSort("age")}>Age</th>
                <th onClick={() => handleSort("company.title")}>Designation</th>
                <th onClick={() => handleSort("address.country")}>Location</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <img src={user.image} alt="employee" height="100px" width="200px" />
                  </td>
                  <td>{`${user.firstName} ${user.lastName}`}</td>
                  <td>{user.gender}</td>
                  <td>{user.age}</td>
                  <td>{user.company.title}</td>
                  <td>{`${user.address.state}, ${user.address.country}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </>
  );
};

export default EmployeeList;

