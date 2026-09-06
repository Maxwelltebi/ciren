(function() {
    const deck = document.getElementById('carousel-deck');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dots = document.querySelectorAll('#carousel-dots button');
    const cards = document.querySelectorAll('.carousel-card');

    if (!deck || !cards.length) return;

    function getCardStep() {
      const firstCard = cards[0];
      return firstCard ? (firstCard.getBoundingClientRect().width * 0.75) : 260;
    }

    function updateActiveDot() {
      const scrollPos = deck.scrollLeft;
      const totalScroll = deck.scrollWidth - deck.clientWidth;
      let activeIndex = 0;
      if (totalScroll > 0) {
        const ratio = scrollPos / totalScroll;
        activeIndex = Math.min(dots.length - 1, Math.max(0, Math.round(ratio * (dots.length - 1))));
      }

      dots.forEach((dot, idx) => {
        if (idx === activeIndex) {
          dot.className = 'w-2.5 h-2.5 rounded-full bg-[#0B0F19] ring-2 ring-[#40b830]/40 transition-all focus:outline-none';
        } else {
          dot.className = 'w-2.5 h-2.5 rounded-full bg-slate-300 hover:bg-slate-400 transition-all focus:outline-none';
        }
      });
    }

    prevBtn?.addEventListener('click', () => {
      deck.scrollBy({ left: -getCardStep(), behavior: 'smooth' });
    });

    nextBtn?.addEventListener('click', () => {
      deck.scrollBy({ left: getCardStep(), behavior: 'smooth' });
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        if (cards[idx]) {
          cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    });

    deck.addEventListener('scroll', () => {
      clearTimeout(deck._scrollTimeout);
      deck._scrollTimeout = setTimeout(updateActiveDot, 60);
    });

    // Centre the deck on the middle card.
    //
    // Deliberately NOT scrollIntoView(): that scrolls every scrollable
    // ancestor, including the page, so it dragged the whole window down to the
    // carousel on first load and again on every refresh.
    // scrollLeft only ever moves the deck.
    //
    // Runs immediately rather than on window.load - the script is deferred, so
    // layout is already settled, and waiting for images caused a visible jump.
    const mid = cards[2];
    if (mid) {
      deck.scrollLeft +=
        mid.getBoundingClientRect().left -
        deck.getBoundingClientRect().left -
        (deck.clientWidth - mid.offsetWidth) / 2;
      // Markup hardcodes dot 2 as active, but we centre card 3. Sync them.
      updateActiveDot();
    }
  })();
