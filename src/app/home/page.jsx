"use client";
import Image from "next/image";
import React, { useState } from "react";
import model1 from "../../../public/images/hero-1.webp";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import swal from "sweetalert";
import axios from "axios";
import logo from '../../../public/images/logo.png'
import { useAuth } from "../auth/login";

const Page = () => {
  const [show, setShow] = useState(false);
  const [domain, setDomain] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [inputError, setInputError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginBtnVisible, setLoginBtnVisible] = useState(true);
  const [userName, setUserName] = useState("");


  const auth = useAuth();

  const signIn = async (username, tokenid) => {
    const regex = /\.mmit$/;
    if (!regex.test(domain) || !domain || !tokenId) {
      setInputError("Please fill all the fields");
      return;
    }
    setLoading(true);
    let response;
    try {
      response = await axios.get(`/api/sdk`, {
        params: {
          username: username,
          id: tokenid
        }
      });
    } catch (error) {
      console.error(error);
    }
    const uservalidator = response?.data?.data
    if (uservalidator.success == true) {
      setLoginBtnVisible(false);
      const user = domain.slice(0, -5);
      setUserName("welcome " + user)
      handleClose()
      setLoading(false);
    }
    else {
      swal("Error", `${uservalidator.message}`, "error");
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    auth.login({ domain, tokenId });
    signIn(domain, tokenId)
  };


  const logOutUser = () => {
    setLoginBtnVisible(true);
  };

  const handleClose = () => {
    setShow(false);
    setDomain("");
    setTokenId("");
  };
  const handleShow = () => setShow(true);
  return (
    <div className="box-border w-full hero-bg-img">
      <div className="flex justify-between flex-wrap items-center py-4 px-5 gap-4 bg-black text-white border-b border-[hsla(0,0%,100%,.3)]">
        <div className="w-full sm:w-auto text-center sm:text-left text-4xl sm:mb-0">
          <Image src={logo} alt="logo" className="mx-auto sm:mx-0 w-[200px]" />
        </div>
          <h2 className="text-center text-2xl">{userName}</h2>
      </div>

      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/2 p-6">
          <h3 className="text-[4rem] sm:text-[6rem] font-bold tracking-[-.03rem] text-white leading-[1.25] mb-6">
            Robust for coders. Speedy for all.
          </h3>
          {loginBtnVisible ? (
            <button
              className="bg-black text-white py-3 px-5 rounded-full font-medium border border-white w-full sm:w-auto hover:opacity-[0.60]"
              onClick={handleShow}
            >
              Login With MMIT Domain
            </button>
          ) : (
            <button
              className="bg-black text-white py-3 px-5 rounded-full font-medium border border-white w-full sm:w-auto hover:opacity-[0.60]"
              onClick={logOutUser}
            >
              Logout
            </button>
          )}

          {loading ? (
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title className="text-[#fff]">Insert Your MMIT Domain</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                      type="text"
                      placeholder="Domain"
                      onChange={(e) => {
                        setDomain(e.target.value);
                        setInputError("");
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control
                      type="number"
                      placeholder="Token Id"
                      onChange={(e) => {
                        setTokenId(e.target.value);
                        setInputError("");
                      }}
                    />
                  </Form.Group>

                  <p className="text-danger my-2">{inputError}</p>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="dark" onClick={onSubmit}>
                  Login
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </div>

        <div className="w-full sm:w-1/2 flex justify-center">
          <div>
            <Image src={model1} alt="image" className="m-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;