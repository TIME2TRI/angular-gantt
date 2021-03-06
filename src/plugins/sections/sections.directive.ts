import angular from 'angular'

export default function ($compile, $document) {
  'ngInject'
  return {
    restrict: 'E',
    require: '^gantt',
    scope: {
      enabled: '=?',
      keepProportions: '=?',
      disableMagnet: '=?',
      disableDaily: '=?'
    },
    link: function (scope, element, attrs, ganttCtrl) {
      let api = ganttCtrl.gantt.api

      // Load options from global options attribute.
      if (scope.options && typeof(scope.options.sections) === 'object') {
        for (let option in scope.options.sections) {
          scope[option] = scope.options.sections[option]
        }
      }

      if (scope.enabled === undefined) {
        scope.enabled = true
      }

      if (scope.keepProportions === undefined) {
        scope.keepProportions = true
      }

      api.directives.on.new(scope, function (directiveName, taskScope, taskElement) {
        if (directiveName === 'ganttTaskForeground') {
          let sectionsScope = taskScope.$new()
          sectionsScope.pluginScope = scope
          sectionsScope.task = taskScope.task

          let ifElement = $document[0].createElement('div')
          angular.element(ifElement).attr('data-ng-if', 'task.model.sections !== undefined && pluginScope.enabled')
          angular.element(ifElement).attr('class', 'gantt-task-foreground-sections')

          let sectionsElement = $document[0].createElement('gantt-task-sections')

          if (attrs.templateUrl !== undefined) {
            angular.element(sectionsElement).attr('data-template-url', attrs.templateUrl)
          }
          if (attrs.template !== undefined) {
            angular.element(sectionsElement).attr('data-template', attrs.template)
          }
          angular.element(ifElement).append(sectionsElement)
          taskElement.append($compile(ifElement)(sectionsScope))
        }
      })
    }
  }
}
