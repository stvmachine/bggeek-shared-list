import React from "react";
import { NextPage } from "next";

type MyAccountProps = {};

const MyAccount: NextPage<MyAccountProps> = () => {
  return <div>my account</div>;
};

export const getServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default MyAccount;
