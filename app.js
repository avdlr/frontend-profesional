(function () {
  'use strict';

  var services = [
    {
      name: 'Posters',
      icon: '🖼️',
      description: 'Vibrant indoor and outdoor posters for launches, menus, events, and storefront promotions.'
    },
    {
      name: 'Keychains',
      icon: '🔑',
      description: 'Durable branded keychains that keep your company visible long after each customer visit.'
    },
    {
      name: 'Uniforms',
      icon: '👕',
      description: 'Professional embroidered or printed uniforms for teams, crews, events, and customer-facing staff.'
    },
    {
      name: 'Billboards',
      icon: '🏙️',
      description: 'Large-format billboard artwork and production support for high-impact local awareness campaigns.'
    },
    {
      name: 'Promotional Products',
      icon: '🎁',
      description: 'Custom giveaways, event merchandise, and branded bundles designed around your campaign goals.'
    }
  ];

  if (window.angular) {
    angular.module('brandForgeApp', []).controller('SiteController', function ($scope, $window) {
      var vm = this;

      vm.services = services;
      vm.quote = {};
      vm.formAttempted = false;
      vm.confirmationVisible = false;
      vm.menuOpen = false;
      vm.page = getPageFromHash($window.location.hash);

      vm.setPage = function (page) {
        vm.page = page;
        vm.menuOpen = false;
        $window.location.hash = page;
      };

      vm.toggleMenu = function () {
        vm.menuOpen = !vm.menuOpen;
      };

      vm.submitQuote = function (form) {
        vm.formAttempted = true;
        vm.confirmationVisible = false;

        if (form.$valid) {
          vm.submittedName = vm.quote.fullName;
          vm.confirmationVisible = true;
          vm.quote = {};
          vm.formAttempted = false;
          form.$setPristine();
          form.$setUntouched();
        }
      };

      angular.element($window).on('hashchange', function () {
        $scope.$applyAsync(function () {
          vm.page = getPageFromHash($window.location.hash);
        });
      });
    });
  } else {
    document.addEventListener('DOMContentLoaded', bootstrapFallback);
  }

  function getPageFromHash(hashValue) {
    var hash = (hashValue || '#home').replace('#', '');
    return ['home', 'services', 'quote'].indexOf(hash) >= 0 ? hash : 'home';
  }

  function bootstrapFallback() {
    var pages = ['home', 'services', 'quote'];
    var menuToggle = document.querySelector('.menu-toggle');
    var navLinks = document.querySelector('.nav-links');
    var form = document.querySelector('.quote-form');
    var confirmation = document.querySelector('.confirmation');
    var error = document.querySelector('.form-error');

    renderServicesFallback();
    if (confirmation) {
      confirmation.style.display = 'none';
    }
    if (error) {
      error.style.display = 'none';
    }

    setPage(getPageFromHash(window.location.hash));

    document.querySelectorAll('[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function () {
        setPage(getPageFromHash(link.getAttribute('href')));
        if (navLinks) {
          navLinks.classList.remove('is-open');
        }
      });
    });

    if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', function () {
        navLinks.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('is-open'));
      });
    }

    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (form.checkValidity()) {
          var nameInput = form.querySelector('[name="fullName"]');
          var name = nameInput && nameInput.value ? nameInput.value : 'friend';
          if (confirmation) {
            confirmation.textContent = 'Thank you, ' + name + '! Your quote request has been received. We will contact you shortly.';
            confirmation.style.display = 'block';
          }
          if (error) {
            error.style.display = 'none';
          }
          form.reset();
        } else {
          if (confirmation) {
            confirmation.style.display = 'none';
          }
          if (error) {
            error.style.display = 'block';
          }
        }
      });
    }

    window.addEventListener('hashchange', function () {
      setPage(getPageFromHash(window.location.hash));
    });

    function setPage(page) {
      pages.forEach(function (pageName) {
        var section = document.getElementById(pageName);
        if (section) {
          section.style.display = pageName === page ? '' : 'none';
        }
      });

      document.querySelectorAll('.nav-links a').forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + page);
      });
    }

    function renderServicesFallback() {
      var serviceGrid = document.querySelector('.services-grid');
      var serviceSelect = document.querySelector('[name="service"]');

      if (serviceGrid && serviceGrid.children.length === 1) {
        serviceGrid.innerHTML = services.map(function (service) {
          return '<article class="service-card"><div class="service-icon" aria-hidden="true">' + service.icon + '</div><h3>' + service.name + '</h3><p>' + service.description + '</p></article>';
        }).join('');
      }

      if (serviceSelect && serviceSelect.children.length <= 2) {
        serviceSelect.innerHTML = '<option value="" disabled selected>Select a service</option>';
        services.forEach(function (service) {
          var option = document.createElement('option');
          option.value = service.name;
          option.textContent = service.name;
          serviceSelect.appendChild(option);
        });
      }
    }
  }
})();
