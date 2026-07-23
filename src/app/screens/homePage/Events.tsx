import { Box, Stack } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import { events } from "../../../lib/data/events";

SwiperCore.use([Autoplay, Navigation, Pagination]);

export default function Events() {
  return (
    <div className={"events-frame"}>
      <Stack className={"events-main"}>
        <Box className={"events-text"}>
          <span className={"category-title"}>Events</span>
        </Box>

        <Swiper
          className={"events-info swiper-wrapper"}
          slidesPerView={"auto"}
          centeredSlides={true}
          spaceBetween={30}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            el: ".swiper-pagination",
            clickable: true,
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: true,
          }}
        >
          {events.map((value) => {
            return (
              <SwiperSlide key={value.id} className={"events-info-frame"}>
                <div className={"events-img-well"}>
                  <img
                    src={value.image}
                    alt={value.title}
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                    }}
                  />
                </div>
                <Box className={"events-desc"}>
                  <strong className={"event-title"}>{value.title}</strong>

                  <div className={"event-organizator"}>
                    <img src={"/icons/speaker.svg"} alt={""} />
                    <p className={"spec-text-author"}>{value.host}</p>
                  </div>

                  <p className={"text-desc"}>{value.description}</p>

                  <div className={"bott-info"}>
                    <div className={"bott-info-main"}>
                      <img src={"/icons/calendar.svg"} alt={""} />
                      {value.date}
                    </div>
                    <div className={"bott-info-main"}>
                      <img src={"/icons/location.svg"} alt={""} />
                      {value.location}
                    </div>
                  </div>
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <Box className={"prev-next-frame"}>
          <span className={"swiper-button-prev"} aria-label={"Previous"} />
          <div className={"dot-frame-pagination swiper-pagination"}></div>
          <span className={"swiper-button-next"} aria-label={"Next"} />
        </Box>
      </Stack>
    </div>
  );
}
