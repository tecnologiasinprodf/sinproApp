import React from 'react';

const UserContext = React.createContext(null);

const UserProvider = (props) => {
  const [user, setUser] = React.useState(null);

  return (
    <UserContext.Provider value={{user, setUser}}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = React.useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserContext. Wrap a parent component in <UserContext> to fix this error.");
  }

  return context;
}

export default UserProvider;
