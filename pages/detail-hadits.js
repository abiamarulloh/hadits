import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from 'next/router';
import queryString from "query-string";
import { useEffect, useState } from "react";
import styles from "../styles/detail-hadits.module.css";

function DetailHadits() {
  const [dataDetailHadits, setDataDetailHadits] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isListening, setListening] = useState(false);
  const [synth, setSynth] = useState()
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    handlehaditsOnLoad();

    const synth = window.speechSynthesis;
    synth.cancel()
    setSynth(synth)
  }, []);

  const handlehaditsOnLoad = () => {
    const { id, haditsType } = queryString.parse(router.asPath.split(/\?/)[1]);
    const params = {
      hadits: textConverter(haditsType, "_", "-"),
      id: id
    };
    getDetailHadits(params);
  };

  const getDetailHadits = (params) => {
    const  { id, hadits } = params
    fetch(
      `/api/hadist/${hadits}/${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setDataDetailHadits(data);
        setLoading(false);
      });
  };

   const textConverter = (text, separator, expectSeparator) => {
     return text ? text.split(separator).join(expectSeparator) : text
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

  const handleStartListeningHadits = (e) => {
    setListening(true)
    let voices = synth.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase();
      const bname = b.name.toUpperCase();

      if (aname < bname) {
        return -1;
      } else if (aname == bname) {
        return 0;
      } else {
        return +1;
      }
    });

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = voices;
    }

    e.preventDefault();

    if(synth.paused) {
      synth.resume();
    }else {
      speak(voices);
    }
  }

  const speak = (voices) => {
    if (synth.speaking) {
      console.error("speechSynthesis.speaking");
      return;
    }

    const utterThis = new SpeechSynthesisUtterance(dataDetailHadits.terjemah);

    utterThis.onend = function (event) {
      console.log("SpeechSynthesisUtterance.onend");
      synth.cancel();
      setListening(false)
    };

    utterThis.onerror = function (event) {
      console.error("SpeechSynthesisUtterance.onerror");
    };

    const selectedOption = "Damayanti"
    for (let i = 0; i < voices.length; i++) {
      if (voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
        break;
      }
    }
    
    utterThis.pitch = 1;
    utterThis.rate = 1;
    synth.speak(utterThis);
  }

  const handleStopListeningHadits = (e) => {
    setListening(false)
    e.preventDefault()
    synth.pause()
  }

  if (!dataDetailHadits) return <p>No hadits data</p>;

  return (
    <>
      {isLoading ? (
        handleLoader()
      ) : (
        <div className={styles.detailHaditsWrapper}>
          <div className={styles.detailHadits}>
              <h3>
                {textConverter(dataDetailHadits.kitab, "_", " ")}
              </h3>

              <div className={styles.listenHadits}>
                {isListening ? 'Sedang Mendengarkan' : 'Klik untuk mendengarkan' }  &nbsp;
                {!isListening ? <FontAwesomeIcon icon="fas-solid fa-circle-play" size="lg" onClick={(e) => handleStartListeningHadits(e)} /> : 
                <FontAwesomeIcon icon="fas-solid fa-volume-high" size="lg" onClick={(e) => handleStopListeningHadits(e)} beatFade />
                }
                
              </div>
              
              <p dir="rtl">
                {dataDetailHadits.arab}
              </p>
              <p>
                {dataDetailHadits.terjemah}
              </p>
          </div>
        </div>
      )}
    </>
  );
}

export default DetailHadits;
