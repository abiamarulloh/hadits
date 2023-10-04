import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/index.module.css";

function HomePage() {
  const [dataHadits, setDataHadits] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [dataSearch, setSearch] = useState("");
  const [dataHaditsType, setHaditsType] = useState("shahih-bukhari");
  const [dataSuggestion, setSuggestion] = useState();
  const listSuggestion = [
    "hadits tentang berqur'ban",
    "hadits tentang zakat",
    "hadits tentang Infaq",
    "hadits tentang Puasa senin kamis",
    "hadits tentang Puasa Arafah",
    "hadits tentang Puasa Tarwiyah",
    "hadits tentang menikah",
    "hadits tentang bercerai",
  ];
  const [isShowModalSearchText, setShowModalSearchText] = useState(false);
  const [isShowModalSearchVoice, setShowModalSearchVoice] = useState(false);
  const [isStartRecording, setStartRecording] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recognition, setRecognition] = useState();

  const listHadits = [
    {
      type: "shahih-bukhari",
      name: "Shahih Bukhari",
    },
    {
      type: "shahih-muslim",
      name: "Shahih muslim",
    },
    {
      type: "sunan-tirmidzi",
      name: "Sunan Tirmidzi",
    },
  ];

  useEffect(() => {
    setLoading(true);
    handlehaditsOnLoad();

    if ("webkitSpeechRecognition" in window) {
      // Speech Recognition Stuff goes here
      let speechRecognition = new webkitSpeechRecognition();
      speechRecognition.continuous = true;
      speechRecognition.interimResults = false;
      speechRecognition.lang = "id";
      setRecognition(speechRecognition);
    } else {
      console.log("Speech Recognition Not Available");
    }
  }, []);

  const handlehaditsOnLoad = () => {
    const params = {
      hadits: dataHaditsType,
      page: 1,
      search: dataSearch,
    };
    getHadits(params);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const params = {
      hadits: dataHaditsType,
      page: 1,
      search: dataSearch,
    };
    getHadits(params);
    window.scrollTo({
      top: window.innerHeight + 200,
      left: 100,
      behavior: "smooth",
    });
  };

  const getHadits = (params) => {
    fetch(
      `/api/hadist/${params.hadits}?page=${params.page}&search=${params.search}`
    )
      .then((res) => res.json())
      .then((data) => {
        setDataHadits(data);
        setLoading(false);
        setShowModalSearchText(false);
        setShowModalSearchVoice(false);
      });
  };

  const changeHadits = (haditsType) => {
    const params = {
      hadits: haditsType,
      page: 1,
      search: dataSearch,
    };

    getHadits(params);
    setHaditsType(haditsType);
    setCurrentPage(1);
  };

  const changeHaditsSuggestion = (suggestion) => {
    const params = {
      hadits: dataHaditsType,
      page: 1,
      search: suggestion,
    };

    getHadits(params);
    setSuggestion(suggestion);
  };

  const textConverter = (text, separator) => {
    return text.split(separator).join(" ");
  };

  const handleLoader = (event) => {
    if (isLoading) {
      return (
        <div className="wrapLoading">
          <div className="loading">
            <FontAwesomeIcon icon="spinner" size="lg" spin />
          </div>
        </div>
      );
    }
  };

  const handleCloseSubmit = () => {
    setShowModalSearchText(false);
    setSearch("");
    const params = {
      hadits: dataHaditsType,
      page: 1,
      search: "",
    };
    getHadits(params);
  };

  const handleChangePagination = (page, type) => {
    if (type === "previous" && page > 1) {
      page--;
    } else if (type === "next") {
      page++;
    }

    const params = {
      hadits: dataHaditsType,
      page: page,
      search: dataSearch,
    };
    setCurrentPage(page);
    getHadits(params);
  };

  const templateModalSearchText = () => {
    return (
      <div className={`${styles.home_action_filter_search}`}>
        <div
          className={`${styles.home_action_filter_item} ${styles.home_action_filter_item_search}`}
        >
          <div className={styles.home_action_filter_wrap_item}>
            <div className={styles.home_text_title_search}>
              Cari hadits berdasarkan periwayat! (
              {textConverter(dataHaditsType, "-")})
            </div>
            <div className={styles.home_action_filter_input}>
              <input
                type="text"
                placeholder="Silahkan cari hadits"
                onChange={(e) => setSearch(e.target.value)}
              />
              <button onClick={(e) => handleSubmit(e)}>Cari Hadits</button>
              <button onClick={(e) => handleCloseSubmit(e)}>Batal</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const startRecording = (e) => {
    setStartRecording(true);
    recognition.start();
  };

  const stopRecording = (e) => {
    setStartRecording(false);
    recognition.stop();

    recognition.onresult = function (event) {
      let result = event.results[0][0].transcript;
      const params = {
        hadits: dataHaditsType,
        page: 1,
        search: result,
      };
      getHadits(params);
      setSearch(result);
      window.scrollTo({
        top: window.innerHeight + 200,
        left: 100,
        behavior: "smooth",
      });
    };
  };

  const templateModalSearchVoice = () => {
    return (
      <div className={`${styles.home_action_filter_search}`}>
        <div
          className={`${styles.home_action_filter_item} ${styles.home_action_filter_item_search}`}
        >
          <div className={styles.home_action_filter_wrap_item}>
            <div className={styles.home_text_title_search}>
              Cari hadits dengan suara berdasarkan periwayat! (
              {textConverter(dataHaditsType, "-")})
            </div>
            <div className={styles.home_action_filter_input}>
              <div className={styles.home_action_filter_input_item}>
                {!isStartRecording ? (
                  <FontAwesomeIcon
                    icon="fas-regular fa-microphone"
                    size="3x"
                    onClick={(e) => startRecording(e)}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon="fas-thin fa-record-vinyl"
                    size="3x"
                    beatFade
                    onClick={(e) => stopRecording(e)}
                  />
                )}
              </div>
              <button onClick={(e) => handleCloseSubmit(e)}>Batal</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!dataHadits) return <p>No hadits data</p>;

  return (
    <>
      {isLoading ? (
        handleLoader()
      ) : (
        <div className={styles.home}>
          <div className={styles.home_greeting}>Assalamualaikum Akhi/Ukhti</div>

          <div className={styles.home_training}>
            <div className={`${styles.home_training_item}`}>
              <div className={styles.home_training_item_icon}>
                <FontAwesomeIcon
                  icon="fas-regular fa-book-open-reader"
                  size="lg"
                />
              </div>
              <div className={styles.home_training_item_title}>
                Membaca dan mendengarkan hadits
              </div>
            </div>
            <Link href={`http://t.me/hadist_app_bot`}>
              <div className={`${styles.home_training_item}`}>
                <div className={styles.home_training_item_icon}>
                  <FontAwesomeIcon
                    icon="fas-solid fa-mobile-screen-button"
                    size="lg"
                  />
                </div>
                <div className={styles.home_training_item_title}>
                  Baca hadits di telegram
                </div>
              </div>
            </Link>

            <div
              className={`${styles.home_training_item} `}
              onClick={(e) => setShowModalSearchVoice(true)}
            >
              <div className={styles.home_training_item_icon}>
                <FontAwesomeIcon
                  icon="fas-solid fa-microphone-lines"
                  size="lg"
                />
              </div>
              <div className={styles.home_training_item_title}>
                Cari hadits dengan suara
              </div>
            </div>

            <div
              className={`${styles.home_training_item}`}
              onClick={(e) => setShowModalSearchText(true)}
            >
              <div className={styles.home_training_item_icon}>
                <FontAwesomeIcon icon="fas-solid fa-file-lines" size="lg" />
              </div>
              <div className={styles.home_training_item_title}>
                Cari hadits dengan Text
              </div>
            </div>
          </div>

          <div className={styles.home_text_title}>
            Apa kamu sedang butuh saran hadits ?
          </div>
          <div className={styles.home_suggestion}>
            {listSuggestion.map((suggestion, i) => {
              return (
                <div
                  key={i}
                  className={`${styles.home_suggestion_title} ${
                    suggestion === dataSuggestion
                      ? styles.home_suggestion_title_active
                      : ""
                  }`}
                  onClick={(e) => changeHaditsSuggestion(suggestion)}
                >
                  {suggestion}
                </div>
              );
            })}
          </div>

          <div className={styles.home_wrapper_hadits_action}>
            <div className={styles.home_text_title}>
              hadits berdasarkan periwayat!
            </div>
            <div className={styles.home_action_filter}>
              {listHadits.map((hadits, i) => {
                return (
                  <div
                    key={i}
                    className={`${styles.home_action_filter_item} ${
                      dataHaditsType === hadits.type
                        ? styles.home_action_filter_item_active
                        : ""
                    }`}
                    onClick={(e) => changeHadits(hadits.type)}
                  >
                    {hadits.name}
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.home_hadits_popular}>
            {dataHadits.data.map((hadits, i) => (
              <Link
                key={i}
                href={{
                  pathname: "detail-hadits",
                  query: { haditsType: hadits.kitab, id: hadits.id },
                }}
              >
                <div className={styles.home_hadits_popular_item}>
                  <div className={styles.home_hadits_popular_item_type}>
                    {textConverter(hadits.kitab, "_")}
                  </div>
                  <div className={styles.home_hadits_popular_item_title}>
                    {hadits.terjemah}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="pagination">
            <a onClick={(e) => handleChangePagination(currentPage, "previous")}>
              &laquo;
            </a>
            <a onClick={(e) => handleChangePagination(currentPage, "next")}>
              &raquo;
            </a>
          </div>
          <div className="pagination-info">Halaman ke {currentPage}</div>
        </div>
      )}

      {isShowModalSearchText == true ? templateModalSearchText() : ""}
      {isShowModalSearchVoice == true ? templateModalSearchVoice() : ""}
    </>
  );
}

export default HomePage;
